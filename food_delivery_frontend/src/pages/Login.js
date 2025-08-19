import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="card" onSubmit={onSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <label className="label" style={{ marginTop: 8 }}>Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="btn" type="submit" style={{ marginTop: 12 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p style={{ marginTop: 8 }}>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
