import React, { useEffect,useCallback, useState } from 'react';
import axios from 'axios';
import './styles/QuotationForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const QuotationForm = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [suppliers, setSuppliers] = useState([]);
  const [itemsMaster, setItemsMaster] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [form, setForm] = useState({
    quotationNumber: '',
    quotationDate: '',
    supplierId: '',
    remarks: '',
    items: []
  });

  const loadSuppliers = useCallback(async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get(`${API_BASE_URL}/api/suppliers`, { headers });
    setSuppliers(res.data);
  }, [API_BASE_URL]);
  
  const loadItemsMaster = useCallback(async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get(`${API_BASE_URL}/api/items`, { headers });
    setItemsMaster(res.data);
  }, [API_BASE_URL]);
  
  const loadQuotation = useCallback(async (id) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get(`${API_BASE_URL}/api/quotations/${id}`, { headers });
    const q = res.data;
  
    setForm({
      quotationNumber: q.quotationNumber || '',
      quotationDate: q.quotationDate || '',
      supplierId: q.supplier?.id || '',
      remarks: q.remarks || '',
      items: q.lineItems?.map(i => ({
        itemId: i.item?.id,
        itemCode: i.item?.itemCode,
        itemName: i.item?.itemName,
        unit: i.item?.unit?.unitName || '',
        quantity: i.quantity,
        rate: i.rate,
        tax: i.tax
      })) || []
    });
  }, [API_BASE_URL]);
  
  useEffect(() => {
    loadSuppliers();
    loadItemsMaster();
    if (isEdit && id) {
      loadQuotation(id);
    }
  }, [isEdit, id, loadSuppliers, loadItemsMaster, loadQuotation]);
  

  const handleItemChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = value;
    setForm({ ...form, items: updated });
  };

  const addItem = (item) => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          itemId: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          unit: item.unit?.unitName || '',
          quantity: 1,
          rate: 0,
          tax: 0
        }
      ]
    });
    setShowItemModal(false);
  };

  const removeItem = (index) => {
    const updated = [...form.items];
    updated.splice(index, 1);
    setForm({ ...form, items: updated });
  };

  const calculateTotals = () => {
    let totalTaxable = 0, tax = 0;
  
    form.items.forEach(item => {
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

  const handleSubmit = async () => {
    const payload = {
      quotationNumber: form.quotationNumber,
      quotationDate: form.quotationDate,
      supplierId: form.supplierId,
      remarks: form.remarks,
      items: form.items.map(i => ({
        itemId: i.itemId,
        quantity: i.quantity,
        rate: i.rate,
        tax: i.tax
      }))
    };

    try {
      if (isEdit) {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await axios.put(`${API_BASE_URL}/api/quotations/${id}`, payload, { headers });
      } else {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(`${API_BASE_URL}/api/quotations`, payload, { headers });
      }
      navigate('/quotations');
    } catch (err) {
      alert('Save failed. Check console.');
      console.error(err);
    }
  };

  const { totalTaxable, tax, netTotal } = calculateTotals();

  return (
    <div className="quotation-form-container">
      <h2>{isEdit ? 'Edit' : 'Add'} Quotation</h2>

      <div className="quotation-form-grid">
        <div className="form-row">
          <div className="form-field">
            <label>Quotation Number</label>
            <input
              type="text"
              value={form.quotationNumber}
              onChange={e => setForm({ ...form, quotationNumber: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Quotation Date</label>
            <input
              type="date"
              value={form.quotationDate}
              onChange={e => setForm({ ...form, quotationDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Supplier</label>
            <select
              value={form.supplierId}
              onChange={e => setForm({ ...form, supplierId: e.target.value })}
            >
              <option value="">Select Supplier</option>
              {suppliers.map(v => (
                <option key={v.id} value={v.id}>{v.suppName}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Remarks</label>
            <textarea
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>

      <h3>Item Details</h3>
      <button className="add-btn" onClick={() => setShowItemModal(true)}>+ Add Item</button>

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((item, index) => {
            const subtotal = (item.quantity || 0) * (item.rate || 0);
            const taxAmount = subtotal * ((item.tax || 0) / 100);
            const total = Number(subtotal + taxAmount).toFixed(2);
            return (
              <tr key={index}>
                <td>{item.itemCode}</td>
                <td>{item.itemName}</td>
                <td>{item.unit}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={e => handleItemChange(index, 'rate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.tax}
                    onChange={e => handleItemChange(index, 'tax', e.target.value)}
                  />
                </td>
                <td>{total}</td>
                <td>
                  <button className="delete-btn" onClick={() => removeItem(index)}>Remove</button>
                </td>
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

      <button className="submit-btn" onClick={handleSubmit}>
        {isEdit ? 'Update' : 'Save'} Quotation
      </button>

      {/* Item Selection Modal */}
      {showItemModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowItemModal(false)}>×</button>
            <h3>Select Item</h3>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemsMaster.map(item => (
                  <tr key={item.id}>
                    <td>{item.itemCode}</td>
                    <td>{item.itemName}</td>
                    <td>{item.unit?.unitName || '-'}</td>
                    <td>{item.rate || 0}</td>
                    <td>
                      <button onClick={() => addItem(item)}>+ Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationForm;
