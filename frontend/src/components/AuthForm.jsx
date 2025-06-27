import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AuthForm({ setToken, setUser }) {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '', bankBalance: 100 });

  const handleAuth = async (e) => { 
    e.preventDefault();
    try {
      const endpoint = authMode === 'signup' ? 'signup' : 'login';
      const response = await axios.post(`${API_URL}/auth/${endpoint}`, formData);
      if (response.data.success) {
        if (authMode === 'login') {
          setToken(response.data.token);
          setUser(formData.username);
        } else {
          alert('Account created! Please login.');
          setAuthMode('login');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Auth failed');
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h1>🎮 Box Guessing Game</h1>
        <div className="auth-toggle">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Signup</button>
        </div>
        <form onSubmit={handleAuth}>  
          <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          {authMode === 'signup' && (
            <input type="number" placeholder="Initial Bank Balance" value={formData.bankBalance} onChange={(e) => setFormData({...formData, bankBalance: e.target.value})} required />
          )}
          <button type="submit" className="btn-primary">
            {authMode === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
    