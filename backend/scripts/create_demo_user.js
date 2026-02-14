const db = require('../src/db');
const bcrypt = require('bcryptjs');

async function run(){
  const username = 'demo';
  const password = 'demo1234';
  const hash = bcrypt.hashSync(password, 8);
  try{
    await db.query('INSERT INTO users(username,password_hash,created_at) VALUES($1,$2,datetime(\'now\'))', [username, hash]);
    console.log('Demo user created:', username, '/', password);
  }catch(e){
    console.log('Could not create demo user (maybe exists)');
  }
  process.exit(0);
}

run();
