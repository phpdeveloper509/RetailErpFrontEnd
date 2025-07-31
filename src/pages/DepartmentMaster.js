import React, { useEffect,useCallback, useState } from 'react';
import axios from 'axios';
import deptStyle from './styles/DepartmentMaster.module.css';

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [form, setForm] = useState({
    departmentName: '',
    description: '',
    email: '',
    telephone: '',
    fax: '',
    departmentHead: ''
  });
  const [currentId, setCurrentId] = useState(null);

  const loadDepartments = useCallback(async () => {
    try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_BASE_URL}/api/departments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDepartments(res.data);
  } catch (err) {
    console.error('Error loading customers:', err);
  }
}, [API_BASE_URL]); 

useEffect(() => {
  loadDepartments();
}, [loadDepartments]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (dept = null) => {
    if (dept) {
      setForm(dept);
      setIsEditing(true);
      setCurrentId(dept.id);
    } else {
      setForm({
        departmentName: '',
        description: '',
        email: '',
        telephone: '',
        fax: '',
        departmentHead: ''
      });
      setIsEditing(false);
      setCurrentId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const url = isEditing
      ? `${API_BASE_URL}/api/departments/${currentId}`
      : `${API_BASE_URL}/api/departments`;

    const method = isEditing ? axios.put : axios.post;

    try {
      await method(url, form, { headers });
      setShowModal(false);
      loadDepartments();
    } catch (err) {
      console.error('Error saving department:', err);
    }
  };

  return (
    <div className={deptStyle['department-container']}>
      <div className={deptStyle['department-header']}>
        <h2>Department Master</h2>
        <button className={deptStyle['add-button']} onClick={() => openModal()}>+ Add Department</button>
      </div>

      <table className={deptStyle['department-table']}>
        <thead>
          <tr>
            <th>Name</th><th>Description</th><th>Email</th><th>Phone</th><th>Fax</th><th>Head</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.description}</td>
              <td>{d.email}</td>
              <td>{d.telephone}</td>
              <td>{d.fax}</td>
              <td>{d.deptHead}</td>
              <td>
                <button className={deptStyle['edit-btn']} onClick={() => openModal(d)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={deptStyle['modal']}>
          <div className={deptStyle['modal-content']}>
            <h3>{isEditing ? 'Edit Department' : 'Add Department'}</h3>
            <input name="name" placeholder="Department Name" value={form.name} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
            <input name="telephone" placeholder="Telephone" value={form.telephone} onChange={handleChange} required />
            <input name="fax" placeholder="Fax" value={form.fax} onChange={handleChange} />
            <input name="deptHead" placeholder="Department Head" value={form.deptHead} onChange={handleChange} required />
            <div className={deptStyle['modal-actions']}>
              <button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentMaster;
