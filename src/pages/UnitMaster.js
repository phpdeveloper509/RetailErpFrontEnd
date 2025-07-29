import React, { useEffect, useState } from 'react';
import axios from 'axios';
import unitStyle from './styles/ItemCategory.module.css';

function UnitMaster() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ unitName: '', unitDescription: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const load = async () => {
      const res = await axios.get('http://localhost:8080/api/units', {
        headers: { Authorization: `Bearer ${token}` }
      });
    setUnits(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
  
    if (editingId) {
      await axios.put(`http://localhost:8080/api/units/${editingId}`, form, { headers });
    } else {
      await axios.post('http://localhost:8080/api/units', form, { headers });
    }

    setShowModal(false);
    setForm({ unitName: '', unitDescription: '' });
    setEditingId(null);
    load();
  };

  const openModal = (unit = null) => {
    if (unit) {
      setForm(unit);
      setEditingId(unit.id);
    } else {
      setForm({ unitName: '', unitDescription: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:8080/api/units/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    load();
  };

  return (
    <div className={unitStyle['item-category']}>
      <div className={unitStyle['header']}>
        <h2>Unit Of Measurement</h2>
        <button onClick={() => openModal()}>+ Add</button>
      </div>

      <table>
        <thead>
          <tr><th>Name</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {units.map(c => (
            <tr key={c.id}>
              <td>{c.unitName}</td>
              <td>{c.unitDescription}</td>
              <td>
                <button onClick={() => openModal(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={unitStyle['modal']}>
          <div className={unitStyle['modal-content']}>
            <h3>{editingId ? "Edit" : "Add"} Unit of Measurement</h3>
            <input placeholder="Name" value={form.unitName} onChange={e => setForm({ ...form, unitName: e.target.value })} />
            <input placeholder="Description" value={form.unitDescription} onChange={e => setForm({ ...form, unitDescription: e.target.value })} />
            <button onClick={handleSubmit}>{editingId ? "Update" : "Save"}</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitMaster;
