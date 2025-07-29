import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './styles/Product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/products', { headers });
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:8080/api/products', form, { headers });
      setForm({ name: '', price: '', stock: '' });
      loadProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, { headers });
      loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="product-container">
      <h2>Products</h2>

      

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>{prod.price}</td>
              <td>{prod.stock}</td>
              <td>
                <button className="delete" onClick={() => handleDelete(prod.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;