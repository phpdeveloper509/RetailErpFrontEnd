import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles/Users.module.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', password: '', role: 'CASHIER' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users', { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:8080/api/users', form, { headers });
      setForm({ name: '', email: '', mobile: '', address: '' , role: 'CASHIER', password: ''});
      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleUpdateUser = async () => {
    console.log('Submitting user update:', editingUser.id, editForm);
    try {
      await axios.put(`http://localhost:8080/api/users/update/${editingUser.id}`, editForm, { headers });
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };
  

/*Editing User*/

const [editingUser, setEditingUser] = useState(null); // User object to edit
const [editForm, setEditForm] = useState({
  name: '',
  email: '',
  mobile: '',
  address: '',
  role: '',
});
const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      role: user.role,
    });
  };
  


  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className={styles['user-container']}>
      <div className={styles['user-header']}>
        <h2>Users</h2>
        <button className={styles['add-user-btn']} onClick={() => setShowModal(true)}>
            + Add User
        </button>
      </div>

      <table className={styles['user-table']}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Mobile</th><th>Address</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td> <button className={styles['edit-btn']} onClick={() => openEditModal(user)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {showModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <h3>Add New User</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input  type="password"  name="password"  placeholder="Password"  value={form.password}  onChange={handleChange}/>
            <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <select name="role" value={form.role} onChange={handleChange}>
                <option value="ADMIN">ADMIN</option>
                <option value="CASHIER">CASHIER</option>
            </select>
            <div className={styles['modal-actions']}>
              <button className={styles['submit-btn']} onClick={handleAddUser}>Submit</button>
              <button className={styles['cancel-btn']} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

{editingUser && (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal']}>
        <h3>Edit User</h3>
        <input name="name" placeholder='Name' value={editForm.name} onChange={handleEditChange} />
        <input name="email" placeholder='Email' value={editForm.email} onChange={handleEditChange} />
        <input name="mobile" placeholder='Mobile' value={editForm.mobile} onChange={handleEditChange} />
        <input name="address" placeholder='address' value={editForm.address} onChange={handleEditChange} />
  
        <select name="role" value={editForm.role} onChange={handleEditChange}>
          <option value="ADMIN">ADMIN</option>
          <option value="CASHIER">CASHIER</option>
        </select>
  
        <div className={styles['modal-actions']}>
          <button className={styles['submit-btn']} onClick={handleUpdateUser}>Save</button>
          <button className={styles['cancel-btn']} onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};

  
export default Users;
