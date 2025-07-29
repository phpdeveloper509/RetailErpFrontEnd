import React, { useEffect, useState } from 'react';
import axios from 'axios';
import itmStyles from './styles/ItemMaster.module.css';

function ItemMaster() {
  const [items, setItems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({
    itemCode: '',
    itemName: '',
    itemCategoryId: '',
    unitId: '',
    description: ''
  });

  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadData = async () => {
    const [itemRes, catRes, unitRes] = await Promise.all([
      axios.get('http://localhost:8080/api/items', { headers }),
      axios.get('http://localhost:8080/api/itemcategories', { headers }),
      axios.get('http://localhost:8080/api/units', { headers })
    ]);
    setItems(itemRes.data);
    setCategories(catRes.data);
    setUnits(unitRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.itemCode || !form.itemName || !form.itemCategoryId || !form.unitId) {
      alert('Please fill all required fields.');
      return;
    }
  
    const payload = {
      itemCode: form.itemCode,
      itemName: form.itemName,
      description: form.description,
      itemCategoryId: { id: parseInt(form.itemCategoryId) },
      unit: { id: parseInt(form.unitId) }
    };
  
    try {
      if (isEdit && editingId) {
        await axios.put(`http://localhost:8080/api/items/${editingId}`, payload, { headers });
      } else {
        await axios.post('http://localhost:8080/api/items', payload, { headers });
      }
  
      setShowModal(false);
      setForm({ itemCode: '', itemName: '', itemCategoryId: '', unitId: '', description: '' });
      setIsEdit(false);
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Save failed. Please check console for details.');
    }
  };
  

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditingId(item.id);
    setForm({
      itemCode: item.itemCode,
      itemName: item.itemName,
      itemCategoryId: item.itemCategoryId?.id || '',
      unitId: item.unit?.id || '',
      description: item.description || ''
    });
    setShowModal(true);
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/api/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    loadData();
  };

  return (
    <div className={itmStyles['item-master-container']}>
      <h2>Item Master</h2>
      <button className={itmStyles['add-btn']} onClick={() => setShowModal(true)}>+ Add Item</button>

      <table className={itmStyles['item-table']}>
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.itemCode}</td>
              <td>{i.itemName}</td>
              <td>{i.itemCategoryId?.name}</td>
              <td>{i.unit?.unitName}</td>
              <td>{i.description}</td>
              <td>
              <button className={itmStyles['edit-btn']} onClick={() => handleEdit(i)}>Edit</button>
                <button className={itmStyles['delete-btn']} onClick={() => handleDelete(i.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={itmStyles['modal']}>
          <div className={itmStyles['modal-box']}>
            <h3>Add New Item</h3>
            <input name="itemCode" placeholder="Item Code" value={form.itemCode} onChange={handleChange} required />
            <input name="itemName" placeholder="Item Name" value={form.itemName} onChange={handleChange} required />
            <select name="itemCategoryId" value={form.itemCategoryId} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select name="unitId" value={form.unitId} onChange={handleChange} required>
              <option value="">Select Unit</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.unitName}</option>
              ))}
            </select>
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

            <div className={itmStyles['modal-actions']}>
              <button onClick={handleSubmit}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemMaster;
