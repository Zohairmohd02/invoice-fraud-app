function detectFraud(invoice){
  const factors = { amountAnomaly:0, vendorRisk:0, dateAnomaly:0, duplicateRisk:0, patternMatch:0 }
  if(invoice.amount>50000) factors.amountAnomaly=0.4
  else if(invoice.amount>20000) factors.amountAnomaly=0.2
  const suspiciousVendors=['quick','cash','urgent','immediate']
  if(suspiciousVendors.some(w=> (invoice.vendor||'').toLowerCase().includes(w))) factors.vendorRisk=0.3
  const d=new Date(invoice.date)
  if(!isNaN(d.getDay) && (d.getDay()===0||d.getDay()===6)) factors.dateAnomaly=0.15
  if(invoice.invoiceNumber && (invoice.invoiceNumber.includes('COPY')||invoice.invoiceNumber.includes('DUP'))) factors.duplicateRisk=0.25
  if(invoice.amount%1000===0 && invoice.amount>10000) factors.patternMatch=0.2
  const riskScore=Math.min((factors.amountAnomaly+factors.vendorRisk+factors.dateAnomaly+factors.duplicateRisk+factors.patternMatch)*100,100)
  let riskLevel='low', color='green'
  if(riskScore>60){riskLevel='high';color='red'} else if(riskScore>30){riskLevel='medium';color='yellow'}
  return { riskScore:Math.round(riskScore), riskLevel, color, factors, flagged:riskScore>30 }
}

const form=document.getElementById('inv-form')
const results=document.getElementById('results')

form.addEventListener('submit', e=>{
  e.preventDefault()
  const invoiceNumber=document.getElementById('num').value
  const vendor=document.getElementById('vendor').value
  const amount=parseFloat(document.getElementById('amount').value||0)
  const date=document.getElementById('date').value || new Date().toISOString().split('T')[0]
  const desc=document.getElementById('desc').value
  const res=detectFraud({ invoiceNumber, vendorName: vendor, vendor, amount, date })
  const node=document.createElement('div')
  node.className='res-item '+res.color
  node.innerHTML=`<div style="display:flex;justify-content:space-between"><div><strong>${invoiceNumber}</strong><div>${vendor}</div></div><div>$${amount.toLocaleString()}</div></div><div>Risk: ${res.riskScore}% — ${res.flagged? 'Flagged':'Approved'}</div>`
  if(res.flagged) node.innerHTML += `<div class="alert">Indicators: ${Object.entries(res.factors).filter(([,v])=>v>0).map(([k])=>k).join(', ')}</div>`
  results.prepend(node)
  form.reset()
})
