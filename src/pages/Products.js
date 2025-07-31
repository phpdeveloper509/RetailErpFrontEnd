import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './styles/Product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`, { headers });
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, { headers });
      loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      };
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