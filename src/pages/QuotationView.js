import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/QuotationForm.css';

const QuotationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
 
  useEffect(() => {
    const loadQuotation = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE_URL}/api/quotations/${id}`, { headers });
        setQuotation(res.data);
      } catch (err) {
        alert('Failed to load quotation');
        console.error(err);
      }
    };
    loadQuotation();
  }, [API_BASE_URL,id]);

  const calculateTotals = () => {
    let totalTaxable = 0, tax = 0;
    (quotation.lineItems || []).forEach(item => {
      const qty = parseFloat(item.quantity || 0);
      const rate = parseFloat(item.rate || 0);
      const taxRate = parseFloat(item.tax || 0);
      const itemSubtotal = qty * rate;
      const itemTax = (itemSubtotal * taxRate) / 100;
  
      totalTaxable += itemSubtotal;
      tax += itemTax;
    });
    return {
      totalTaxable: totalTaxable.toFixed(2),
      tax: tax.toFixed(2),
      netTotal: (totalTaxable + tax).toFixed(2)
    };
  };

  if (!quotation) return <div>Loading...</div>;
  const { totalTaxable, tax, netTotal } = calculateTotals();

  return (
    <div className="quotation-form-container">
      <h2>Quotation Details</h2>
      <div className="quotation-form-grid">
        <div className="form-row">
          <div className="form-field">
            <strong>Quotation Number:</strong> {quotation.quotationNumber || '-'}
          </div>
          <div className="form-field">
            <strong>Date:</strong> {quotation.quotationDate}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <strong>Supplier:</strong> {quotation.supplier?.suppName}
          </div>
          <div className="form-field">
            <strong>Remarks:</strong> {quotation.remarks}
          </div>
        </div>
      </div>

      <h3>Item Details</h3>
      <table className="quotation-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Tax</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {(quotation.lineItems || []).map((lineItem, index) => {
           
            const subtotal = (lineItem.quantity || 0) * (lineItem.rate || 0);
            const taxAmount = subtotal * ((lineItem.tax || 0) / 100);
            const total = Number(subtotal + taxAmount).toFixed(2);

            return (
              <tr key={index}>
                <td>{lineItem.item?.itemCode || '-'}</td>
                <td>{lineItem.item?.itemName || '-'}</td>
                <td>{lineItem.item?.unit?.unitName || '-'}</td>
                <td>{lineItem.quantity}</td>
                <td>{lineItem.rate}</td>
                <td>{lineItem.tax}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="totals">
        <div>Total Taxable: ₹{totalTaxable}</div>
        <div>Tax: ₹{tax}</div>
        <div><strong>Net Total: ₹{netTotal}</strong></div>
      </div>

      <button className="submit-btn" onClick={() => navigate('/quotations')}>← Back to List</button>
    </div>
  );
};
export default QuotationView;
