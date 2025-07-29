import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './utils/axiosConfig';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import PrivateRoute from './auth/PrivateRoute';
import Sidebar from './components/Sidebar';
import Users from './pages/Users';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import Quotations from './pages/Quotations';
import PurchaseOrder from './pages/PurchaseOrder';
import QuotationForm from './pages/QuotationForm';
import SiteMaster from './pages/SiteMaster';
import DepartmentMaster from './pages/DepartmentMaster';
import Supplier from './pages/Supplier';
import ItemCategory from './pages/ItemCategory';
import ItemMaster from './pages/ItemMaster';
import UnitMaster from './pages/UnitMaster';
import QuotationView from './pages/QuotationView';

// Layout with Sidebar
const AppLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{padding: '20px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout><Dashboard /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/products"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><Products /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <PrivateRoute roles={['ADMIN', 'CASHIER']}>
            <AppLayout><Sales /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><Reports /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><Users /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute roles={['ADMIN', 'CASHIER']}>
            <AppLayout><Customers /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/vendors"
        element={
          <PrivateRoute roles={['ADMIN', 'CASHIER']}>
            <AppLayout><Vendors /></AppLayout>
          </PrivateRoute>
        }
      />
      

      <Route
        path="/quotations"
        element={
          <PrivateRoute roles={['ADMIN', 'CASHIER']}>
            <AppLayout><Quotations /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/purchaseorder"
        element={
          <PrivateRoute roles={['ADMIN', 'CASHIER']}>
            <AppLayout><PurchaseOrder /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quotation/new"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><QuotationForm isEdit={false} /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quotation/edit/:id"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><QuotationForm isEdit={true} /></AppLayout>
          </PrivateRoute>
        }
      />
    <Route
        path="/sites"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><SiteMaster /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><DepartmentMaster /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/suppliers"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><Supplier /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/itemCategory"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><ItemCategory /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/items"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><ItemMaster /></AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/unitMaster"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AppLayout><UnitMaster /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/quotation/view/:id"
        element={
          <PrivateRoute roles={['ADMIN', 'CASHIER']}>
            <AppLayout><QuotationView /></AppLayout>
          </PrivateRoute>
        }
/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
