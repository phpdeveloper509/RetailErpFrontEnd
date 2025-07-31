import React, { useEffect,useCallback, useState } from 'react';
import axios from 'axios';
import catStyle from './styles/ItemCategory.module.css';

function ItemCategory() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem('token'); // Moved inside
      const res = await axios.get(`${API_BASE_URL}/api/itemcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading item Category:', err);
    }
  }, [API_BASE_URL]); // Now token is not needed here
  
  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
  
    if (editingId) {
      await axios.put(`${API_BASE_URL}/api/itemcategories/${editingId}`, form, { headers });
    } else {
      await axios.post(`${API_BASE_URL}/api/itemcategories`, form, { headers });
    }
  
    setShowModal(false);
    setForm({ name: '', description: '' });
    setEditingId(null);
    load();
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
  
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/api/itemcategories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    load();
  };
  

  const openModal = (cat = null) => {
    if (cat) {
      setForm(cat);
      setEditingId(cat.id);
    } else {
      setForm({ name: '', description: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  return (
    <div className={catStyle['item-category']}>
      <div className={catStyle['header']}>
        <h2>Item Categories</h2>
        <button onClick={() => openModal()}>+ Add</button>
      </div>

      <table>
        <thead>
          <tr><th>Name</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>
                <button onClick={() => openModal(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={catStyle['modal']}>
          <div className={catStyle['modal-content']}>
            <h3>{editingId ? "Edit" : "Add"} Category</h3>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button onClick={handleSubmit}>{editingId ? "Update" : "Save"}</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemCategory;
