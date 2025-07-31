import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  UserCog,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Truck,
  Boxes,
  FileText,
  ClipboardList,
  Tags,
  Ruler,
  PackageCheck
} from 'lucide-react';

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const [openMenus, setOpenMenus] = useState({});
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <h2>Retail ERP</h2>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {(role === 'ADMIN' || role === 'CASHIER') && (
          <>
            <div className="nav-link expandable" onClick={() => toggleMenu('master')}>
              <Package size={18} className="sidebar-icon" />
              <span>Master</span>
              {openMenus.master ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {openMenus.master && (
              <div className="sidebar-child">
                {role === 'ADMIN' && (
                  <Link className="nav-link" to="/users">
                    <UserCog size={16} className="sidebar-icon" />
                    <span>Users</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/sites" className="nav-link">
                    <MapPin size={16} className="sidebar-icon" />
                    <span>Sites</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/departments" className="nav-link">
                    <Building2 size={16} className="sidebar-icon" />
                    <span>Departments</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/unitMaster" className="nav-link">
                    <Ruler size={16} className="sidebar-icon" />
                    <span>Units</span>
                  </Link>
                )}
                
                {role === 'ADMIN' && (
                  <Link to="/itemCategory" className="nav-link">
                   <Tags size={16} className="sidebar-icon" />
                    <span>Item Categories</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/items" className="nav-link">
                    <PackageCheck size={16} className="sidebar-icon" />
                    <span>Items</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/suppliers" className="nav-link">
                    <Truck size={16} className="sidebar-icon" />
                    <span>Supplier</span>
                  </Link>
                )}

                <Link to="/products" className="nav-link">
                  <Boxes size={16} className="sidebar-icon" />
                  <span>Products</span>
                </Link>
                <Link to="/customers" className="nav-link">
                  <Users size={16} className="sidebar-icon" />
                  <span>Customers</span>
                </Link>
                {/*<Link to="/vendors" className="nav-link">
                  <Building2 size={16} className="sidebar-icon" />
                  <span>Vendors</span>
                </Link>*/}
              </div>
            )}
          </>
        )}

        {(role === 'ADMIN' || role === 'CASHIER') && (
          <>
            <div className="nav-link expandable" onClick={() => toggleMenu('purchase')}>
              <Package size={18} className="sidebar-icon" />
              <span>Purchase</span>
              {openMenus.purchase ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            {openMenus.purchase && (
              <div className="sidebar-child">
                <Link to="/quotations" className="nav-link">
                  <FileText size={16} className="sidebar-icon" />
                  <span>Quotations</span>
                </Link>
                <Link to="/purchaseorder" className="nav-link">
                  <ClipboardList size={16} className="sidebar-icon" />
                  <span>Purchase Order</span>
                </Link>
              </div>
            )}
          </>
        )}

        {(role === 'ADMIN' || role === 'CASHIER') && (
          <Link to="/sales" className="nav-link">
            <ShoppingCart size={18} />
            Sales
          </Link>
        )}
      </div>

      <button className="logout-button" onClick={logout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
