import React, { useState,useCallback, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
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
  const [search, setSearch] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

  const fetchSites = useCallback(async () => {
    
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSites(res.data);
    } catch (err) {
      console.error('Error fetching sites:', err);
    }
  },[API_BASE_URL]);
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

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
        await axios.put(`${API_BASE_URL}/api/sites/${currentId}`, form, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/sites`, form, { headers });
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

  const columns = [
    { name: 'Code', selector: row => row.siteCode, sortable: true },
    { name: 'Name', selector: row => row.siteName, sortable: true },
    { name: 'Contact Person', selector: row => row.contactPerson, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Phone', selector: row => row.phone, sortable: true },
    {
      name: 'Action',
      cell: row => (
        <button className={siteStyles['edit-btn']} onClick={() => openModal(row)}>
          Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];

  const filteredSites = sites.filter(site =>
    Object.values(site).some(val =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const customStyles = {
    table: {
      style: {
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
        backgroundColor: '#b1bda4',
        color: '#333',
        fontSize: '14px',
        borderBottom: '1px solid #ddd'
      }
    },
    rows: {
      style: {
        fontSize: '13px',
        borderBottom: '1px solid #eee'
      }
    },
    cells: {
      style: {
        borderRight: '1px solid #eee',
        paddingLeft: '8px',
        paddingRight: '8px'
      }
    }
  };

  return (
    <div className={siteStyles['site-container']}>
      <div className={siteStyles['site-header']}>
        <h2>Site Master</h2>
      </div>

      <DataTable
        title="Sites"
        columns={columns}
        data={filteredSites}
        pagination
        highlightOnHover
        customStyles={customStyles}
        subHeader
        subHeaderComponent={
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              <button onClick={() => openModal()} className={siteStyles['add-btn']}>
                + Add Site
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  height: '10px',
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  width: '175px'
                }}
              />
            </div>
          </div>
        }
        
      />

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
