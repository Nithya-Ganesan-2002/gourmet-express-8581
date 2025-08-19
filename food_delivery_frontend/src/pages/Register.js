import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register({ email, password, full_name });
      setSuccess('Registration successful. You can now login.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create account</h2>
      <form className="card" onSubmit={onSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <label className="label">Full name</label>
        <input className="input" value={full_name} onChange={(e)=>setFullName(e.target.value)} />
        <label className="label" style={{ marginTop: 8 }}>Email</label>
        <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <label className="label" style={{ marginTop: 8 }}>Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="btn" type="submit" style={{ marginTop: 12 }} disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p style={{ marginTop: 8 }}>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
