import react, { useState, useEffect } from "react";
import axios from "axios";
import './styles/Supplier.css';

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({
      suppCode: '',
      suppName: '',
      contactPerson: '',
      email: '',
      phone: '',
      country : '',
      state : ''
    });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
  
    const validate = () => {
      let errs = {};
      if (!form.suppCode) errs.suppCode = 'Supplier Code is required';
      if (!form.suppName) errs.suppName = 'Supplier Name is required';
      if (!form.contactPerson) errs.contactPerson = 'Contact Person is required';
      if (!form.email) errs.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email is invalid';
      if (!form.phone) errs.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits';
      setErrors(errs);
      return Object.keys(errs).length === 0;
    };
  
    const fetchSuppliers = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(res.data);
    };
  
    useEffect(() => {
      fetchSuppliers();
    }, []);
  
    const openModal = (supplier = null) => {
      if (supplier) {
        setForm(supplier);
        setIsEditing(true);
        setCurrentId(supplier.id);
      } else {
        setForm({ suppCode: '', suppName: '', contactPerson: '', email: '', phone: '', country: '', state: '' });
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
          await axios.put(`http://localhost:8080/api/suppliers/${currentId}`, form, { headers });
        } else {
          await axios.post('http://localhost:8080/api/suppliers', form, { headers });
        }
        setShowModal(false);
        fetchSuppliers();
      } catch (err) {
        console.error('Error saving supplier:', err.response?.data || err.message);
      }
    };
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
    return (
        <div className="supplier-container">
          <div className="supplier-header">
            <h2>Supplier</h2>
            <button onClick={() => openModal()}>+ Add Supplier</button>
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
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.suppCode}</td>
                  <td>{supplier.suppName}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>
                    <button className='edit-btn' onClick={() => openModal(supplier)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h3>
                <input name="suppCode" placeholder="Supplier Code" value={form.suppCode} onChange={handleChange} />
                <div className="error">{errors.suppCode}</div>
    
                <input name="suppName" placeholder="Supplier Name" value={form.suppName} onChange={handleChange} />
                <div className="error">{errors.suppName}</div>
    
                <input name="contactPerson" placeholder="Contact Person" value={form.contactPerson} onChange={handleChange} />
                <div className="error">{errors.contactPerson}</div>
    
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <div className="error">{errors.email}</div>
    
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                <div className="error">{errors.phone}</div>

                <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />

                <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
    
                <div className="modal-actions">
                  <button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default Supplier;