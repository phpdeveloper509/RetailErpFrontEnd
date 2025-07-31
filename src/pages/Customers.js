import React, { useEffect,useCallback, useState } from 'react';
import axios from 'axios';
import './styles/Customers.css';

function Customers() {
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [form, setForm] = useState({
    name: '', email: '', contact: '', address: ''
  });

  const loadCustomers = useCallback(async (page = 0, size = 5) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/customers?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setCustomers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setCurrentPage(response.data.number || 0);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  }, [API_BASE_URL]); // include any external dependencies here
  
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (customer = null) => {
    if (customer) {
      setForm(customer);
      setCurrentId(customer.id);
      setIsEditing(true);
    } else {
      setForm({ name: '', email: '', contact: '', address: '' });
      setIsEditing(false);
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/customers/${currentId}`, form, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/customers`, form, { headers });
      }

      setShowModal(false);
      setForm({ name: '', email: '', contact: '', address: '' });
      loadCustomers();
    } catch (err) {
      console.error('Error saving customer:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/api/customers/${id}`, { headers });
      loadCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err.response?.data || err.message);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.contact.trim()) {
      newErrors.contact = 'Mobile is required';
    } else if (!/^\d{10}$/.test(form.contact)) {
      newErrors.contact = 'Mobile must be 10 digits';
    }
    if (!form.address.trim()) {
      newErrors.address = 'Address is required'
    }else if(form.address.trim().length<30){
          newErrors.address = 'Address should be minimum 30 Character'
    };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return (
    <div className="customer-container">
      <div className="customer-header">
        <h2>Customer List</h2>
        <button className="add-button" onClick={() => openModal(null)}>Add Customer +</button>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Mobile</th><th>Address</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.contact}</td>
              <td>{c.address}</td>
              <td>
              <button className="edit-btn" onClick={() => openModal(c)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
{/* Pagination Controls */}
<div className="pagination-controls" style={{ marginTop: '10px', textAlign: 'center' }}>
  <button
    onClick={() => loadCustomers(currentPage - 1)}
    disabled={currentPage === 0}
    className="pagination-btn"
  >
    Previous
  </button>

  <span style={{ margin: '0 10px' }}>
    Page {currentPage + 1} of {totalPages}
  </span>

  <button
    onClick={() => loadCustomers(currentPage + 1)}
    disabled={currentPage + 1 >= totalPages}
    className="pagination-btn"
  >
    Next
  </button>
</div>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{isEditing ? 'Edit Customer' : 'Add Customer'}</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange}  maxLength={30} minLength={3}/>
            {errors.name && <div className="error">{errors.name}</div>}
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange}  maxLength={50}/>
            {errors.email && <div className="error">{errors.email}</div>}
            <input name="contact" placeholder="Mobile" value={form.contact} onChange={handleChange}  maxLength={10} minLength={10}/>
            {errors.contact && <div className="error">{errors.contact}</div>}
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} minLength={30} maxLength={100}/>
            {errors.address && <div className="error">{errors.address}</div>}

            <div className="modal-actions">
              <button className='submit-btn' onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
