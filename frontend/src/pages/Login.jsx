import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TENANTS = ['tenantA', 'tenantB'];
const ROLES = ['admin', 'staff'];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tenant, setTenant] = useState(TENANTS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [userName, setUserName] = useState('Test User');

  const handleLogin = (e) => {
    e.preventDefault();
    login(tenant, role, userName);
    navigate('/orders');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mock Login / Tenant Selector</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300 }}>
        <label>Tenant: <select value={tenant} onChange={(e) => setTenant(e.target.value)}>{TENANTS.map(t => <option key={t} value={t}>{t}</option>)}</select></label>
        <label>Role: <select value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></label>
        <label>User Name: <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required /></label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;