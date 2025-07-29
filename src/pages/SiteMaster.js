import React, { useState, useEffect } from 'react';
import axios from 'axios';
import siteStyles from './styles/SiteMaster.module.css';

const SiteMaster = () => {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({
    siteCode: '',
    siteName: '',
    contactPerson: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const validate = () => {
    let errs = {};
    if (!form.siteCode) errs.siteCode = 'Site Code is required';
    if (!form.siteName) errs.siteName = 'Site Name is required';
    if (!form.contactPerson) errs.contactPerson = 'Contact Person is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email is invalid';
    if (!form.phone) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fetchSites = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8080/api/sites', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSites(res.data);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const openModal = (site = null) => {
    if (site) {
      setForm(site);
      setIsEditing(true);
      setCurrentId(site.id);
    } else {
      setForm({ siteCode: '', siteName: '', contactPerson: '', email: '', phone: '' });
      setIsEditing(false);
      setCurrentId(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/sites/${currentId}`, form, { headers });
      } else {
        await axios.post('http://localhost:8080/api/sites', form, { headers });
      }
      setShowModal(false);
      fetchSites();
    } catch (err) {
      console.error('Error saving site:', err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={siteStyles['site-container']}>
      <div className={siteStyles['site-header']}>
        <h2>Site Master</h2>
        <button onClick={() => openModal()}>+ Add Site</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sites.map(site => (
            <tr key={site.id}>
              <td>{site.siteCode}</td>
              <td>{site.siteName}</td>
              <td>{site.contactPerson}</td>
              <td>{site.email}</td>
              <td>{site.phone}</td>
              <td>
                <button className={siteStyles['edit-btn']} onClick={() => openModal(site)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={siteStyles['modal']}>
          <div className={siteStyles['modal-content']}>
            <h3>{isEditing ? 'Edit Site' : 'Add Site'}</h3>
            <input name="siteCode" placeholder="Site Code" value={form.siteCode} onChange={handleChange} />
            <div className={siteStyles['error']}>{errors.siteCode}</div>

            <input name="siteName" placeholder="Site Name" value={form.siteName} onChange={handleChange} />
            <div className={siteStyles['error']}>{errors.siteName}</div>

            <input name="contactPerson" placeholder="Contact Person" value={form.contactPerson} onChange={handleChange} />
            <div className={siteStyles['error']}>{errors.contactPerson}</div>

            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <div className={siteStyles['error']}>{errors.email}</div>

            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <div className={siteStyles['error']}>{errors.phone}</div>

            <div className={siteStyles['modal-actions']}>
              <button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteMaster;
