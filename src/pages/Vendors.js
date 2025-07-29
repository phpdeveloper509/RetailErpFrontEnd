import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Customers.css';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', contact: '', address: ''
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:8080/api/vendors', { headers });
      setVendors(res.data);
    } catch (err) {
      console.error('Error loading vendors:', err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (vendor = null) => {
    if (vendor) {
      setForm(vendor);
      setCurrentId(vendor.id);
      setIsEditing(true);
    } else {
      setForm({ name: '', email: '', contact: '', address: '' });
      setIsEditing(false);
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditing) {
        await axios.put(`http://localhost:8080/api/vendors/${currentId}`, form, { headers });
      } else {
        await axios.post('http://localhost:8080/api/vendors', form, { headers });
      }

      setShowModal(false);
      setForm({ name: '', email: '', contact: '', address: '' });
      loadVendors();
    } catch (err) {
      console.error('Error saving vendor:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:8080/api/vendors/${id}`, { headers });
      loadVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err.response?.data || err.message);
    }
  };

  return (
    <div className="customer-container">
      <div className="customer-header">
        <h2>Vendor List</h2>
        <button className="add-button" onClick={() => openModal(null)}>Add Vendor +</button>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Mobile</th><th>Address</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(c => (
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{isEditing ? 'Edit Vendor' : 'Add Vendor'}</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="contact" placeholder="Mobile" value={form.contact} onChange={handleChange} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

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

export default Vendors;
