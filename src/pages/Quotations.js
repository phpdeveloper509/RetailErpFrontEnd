import React, { useEffect,useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Quotations.css';

function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [filters] = useState({});
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const loadQuotations = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/quotations`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotations(response.data);
    } catch (error) {
      console.error('Failed to load quotations:', error);
    }
  }, [API_BASE_URL, filters]);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);
  
  const handleEdit = (id) => {
    navigate(`/quotation/edit/${id}`);
  };

  return (
    <div className="quotation-container">
      <div className="quotation-header">
        <h2>Quotation List</h2>
        <button className="add-button" onClick={() => navigate('/quotation/new')}>
          Add Quotation +
        </button>
      </div>

      <table className="quotation-table">
        <thead>
          <tr>
            <th>Quotation No</th>
            <th>Date</th>
            <th>Vendor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((q) => (
            <tr key={q.id}>
              <td>{q.quotationNumber}</td>
              <td>{q.quotationDate}</td>
              <td>{q.supplier.suppName}</td>
                <td>
                <button className="edit-btn" onClick={() => handleEdit(q.id)}>
                  Edit
                </button>
                <button className="view-btn" onClick={() => navigate(`/quotation/view/${q.id}`)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default QuotationList;
