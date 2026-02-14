import React, { useState, useEffect } from 'react'
import './InvoiceFraudDetector.css'

// Re-used fraud detection logic (simplified from backend attachment)
const detectFraud = (invoice) => {
  const factors = { amountAnomaly: 0, vendorRisk: 0, dateAnomaly: 0, duplicateRisk: 0, patternMatch: 0 }
  if (invoice.amount > 50000) factors.amountAnomaly = 0.4
  else if (invoice.amount > 20000) factors.amountAnomaly = 0.2
  const suspiciousVendors = ['quick', 'cash', 'urgent', 'immediate']
  if (suspiciousVendors.some(word => (invoice.vendorName || '').toLowerCase().includes(word))) factors.vendorRisk = 0.3
  const date = new Date(invoice.date)
  if (date.getDay && (date.getDay() === 0 || date.getDay() === 6)) factors.dateAnomaly = 0.15
  if (invoice.invoiceNumber && (invoice.invoiceNumber.includes('COPY') || invoice.invoiceNumber.includes('DUP'))) factors.duplicateRisk = 0.25
  if (invoice.amount % 1000 === 0 && invoice.amount > 10000) factors.patternMatch = 0.2
  const riskScore = Math.min((factors.amountAnomaly + factors.vendorRisk + factors.dateAnomaly + factors.duplicateRisk + factors.patternMatch) * 100, 100)
  let riskLevel = 'low', color = 'green'
  if (riskScore > 60) { riskLevel = 'high'; color = 'red' } else if (riskScore > 30) { riskLevel = 'medium'; color = 'yellow' }
  return { riskScore: Math.round(riskScore), riskLevel, color, factors, flagged: riskScore > 30, processingTime: Math.random() * 1.5 + 0.3 }
}

export default function InvoiceFraudDetector(){
  const [invoices, setInvoices] = useState([])
  const [form, setForm] = useState({ invoiceNumber: '', vendorName: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' })
  const [processing, setProcessing] = useState(false)

  useEffect(()=>{
    // noop
  }, [])

  async function handleSubmit(e){
    e && e.preventDefault()
    setProcessing(true)
    await new Promise(r=>setTimeout(r,900))
    const result = detectFraud({ ...form, amount: parseFloat(form.amount || 0) })
    const newInv = { id: Date.now(), ...form, amount: parseFloat(form.amount || 0), ...result, timestamp: new Date().toISOString() }
    setInvoices(prev=>[newInv, ...prev])
    setForm({ invoiceNumber:'', vendorName:'', amount:'', date:new Date().toISOString().split('T')[0], description:'' })
    setProcessing(false)
  }

  return (
    <div className="ifd-root">
      <h1>Invoice Fraud Detector (local)</h1>
      <form className="ifd-form" onSubmit={handleSubmit}>
        <input placeholder="Invoice #" value={form.invoiceNumber} onChange={e=>setForm({...form, invoiceNumber:e.target.value})} />
        <input placeholder="Vendor" value={form.vendorName} onChange={e=>setForm({...form, vendorName:e.target.value})} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} />
        <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button type="submit" disabled={processing || !form.invoiceNumber || !form.vendorName || !form.amount}>{processing ? 'Analyzing...' : 'Analyze Invoice'}</button>
      </form>

      <h2>Results</h2>
      <div className="ifd-list">
        {invoices.length === 0 && <div className="ifd-empty">No invoices analyzed yet</div>}
        {invoices.map(inv => (
          <div key={inv.id} className={`ifd-item ${inv.color}`}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div><strong>{inv.invoiceNumber || '—'}</strong><div>{inv.vendorName}</div></div>
              <div style={{textAlign:'right'}}>${inv.amount.toLocaleString()}</div>
            </div>
            <div className="ifd-meta">Risk: {inv.riskScore}% — {inv.flagged ? 'Flagged' : 'Approved'}</div>
            {inv.flagged && <div className="ifd-alert">Indicators: {Object.entries(inv.factors).filter(([,v])=>v>0).map(([k])=>k).join(', ')}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
