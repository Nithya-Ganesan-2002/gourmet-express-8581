import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const p = await api.getProfile();
        if (!cancelled) {
          setForm({ full_name: p.full_name || '', email: p.email || '' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const updated = await api.updateProfile(form);
      setUser(updated);
      setMsg('Profile updated');
    } catch (e) {
      setMsg(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>My Profile</h2>
      <form className="card" onSubmit={onSave}>
        {msg && <p>{msg}</p>}
        <label className="label">Full name</label>
        <input className="input" value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})} />
        <label className="label" style={{ marginTop: 8 }}>Email</label>
        <input className="input" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} disabled />
        <button className="btn" type="submit" style={{ marginTop: 12 }} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
