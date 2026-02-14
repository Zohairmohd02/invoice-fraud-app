from flask import Flask, request, jsonify
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

MODEL_PATH = 'autoencoder.h5'

def build_autoencoder(input_dim=2):
    inp = keras.Input(shape=(input_dim,))
    x = layers.Dense(8, activation='relu')(inp)
    x = layers.Dense(4, activation='relu')(x)
    x = layers.Dense(8, activation='relu')(x)
    out = layers.Dense(input_dim, activation='linear')(x)
    model = keras.Model(inp, out)
    model.compile(optimizer='adam', loss='mse')
    return model

def train_dummy(model):
    # train on synthetic 'normal' invoice patterns (amount, day)
    rng = np.random.RandomState(42)
    amounts = rng.normal(loc=1000.0, scale=200.0, size=2000)
    days = rng.randint(1,28,size=2000)
    X = np.vstack([amounts, days]).T
    X = (X - X.mean(axis=0)) / X.std(axis=0)
    model.fit(X, X, epochs=10, batch_size=64, verbose=0)
    model.save(MODEL_PATH)

app = Flask(__name__)

if not os.path.exists(MODEL_PATH):
    print('Training model (first run)...')
    ae = build_autoencoder(2)
    train_dummy(ae)
else:
    ae = build_autoencoder(2)
    ae.load_weights(MODEL_PATH)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    invoice = data.get('invoice', {}) if isinstance(data, dict) else {}
    # extract numeric features
    try:
        amount = float(invoice.get('amount', 0) or 0)
    except:
        amount = 0.0
    try:
        date = invoice.get('date')
        day = int(date.split('-')[-1]) if date else np.random.randint(1,28)
    except:
        day = np.random.randint(1,28)

    X = np.array([[amount, day]], dtype=float)
    # normalize using same synthetic stats used in training
    mu = np.array([1000.0, 14.0])
    sigma = np.array([200.0, 8.0])
    Xn = (X - mu) / sigma
    recon = ae.predict(Xn, verbose=0)
    mse = np.mean((Xn - recon)**2)
    # heuristic risk: scale mse into 0-1
    risk_score = float(min(1.0, mse * 10))
    flagged = risk_score > 0.35 or amount > 10000
    return jsonify({ 'risk_score': risk_score, 'flagged': bool(flagged) })

@app.route('/health')
def health():
    return jsonify({'status':'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('MODEL_PORT', 5001))
    app.run(host='0.0.0.0', port=port)
