import React from "react";

export default function InvoiceCard({ 
  paidInvoices = { amount: "$30256.23", period: "Current Fiscal Year" },
  fundsReceived = { amount: "$150256.23", period: "Current Fiscal Year" },
  title 
}) {
  return (
    <div className="invoice-card">
      {title && <h3>{title}</h3>}
      <div className="invoice-item">
        <div className="invoice-label">Paid Invoices</div>
        <div className="invoice-value">{paidInvoices.amount}</div>
        <div className="invoice-period">{paidInvoices.period}</div>
      </div>
      <div className="invoice-item">
        <div className="invoice-label">Funds received</div>
        <div className="invoice-value">{fundsReceived.amount}</div>
        <div className="invoice-period">{fundsReceived.period}</div>
      </div>
    </div>
  );
}