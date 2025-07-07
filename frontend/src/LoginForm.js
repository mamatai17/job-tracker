import React, { useState } from 'react';
import api from './api';

const LoginForm = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await api.post('/signup', form);
        alert('Account created! You can now log in.');
        setIsSignup(false);
      } else {
        const res = await api.post('/login', form);
        localStorage.setItem('token', res.data.access_token);
        onLogin();
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h4 className="mb-3">{isSignup ? 'Sign Up' : 'Login'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input name="username" className="form-control" value={form.username} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <div className="text-center mt-3">
        <button className="btn btn-link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
