import React, { useEffect, useState } from 'react';
import axios from 'axios';
import catStyle from './styles/ItemCategory.module.css';

function ItemCategory() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
      const res = await axios.get('http://localhost:8080/api/itemcategories', {
        headers: { Authorization: `Bearer ${token}` }
      });
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
  
    if (editingId) {
      await axios.put(`http://localhost:8080/api/itemcategories/${editingId}`, form, { headers });
    } else {
      await axios.post('http://localhost:8080/api/itemcategories', form, { headers });
    }

    setShowModal(false);
    setForm({ name: '', description: '' });
    setEditingId(null);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:8080/api/itemcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    load();
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
