import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Restaurants() {
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listRestaurants({ q, city, cuisine });
      setRestaurants(Array.isArray(data) ? data : data?.restaurants || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h2>Browse Restaurants</h2>
      <div className="card">
        <div className="row">
          <div style={{ flex: '2 1 240px' }}>
            <label className="label">Search</label>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sushi, Pizza..." />
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label className="label">City</label>
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label className="label">Cuisine</label>
            <input className="input" value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="Cuisine" />
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button className="btn" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</button>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        {restaurants.map((r) => (
          <div key={r.id || r._id || r.name} className="card">
            <h3>{r.name}</h3>
            <p style={{ opacity: 0.8 }}>{r.cuisine} • {r.city}</p>
            <Link className="btn" to={`/restaurants/${r.id || r._id}`}>View Menu</Link>
          </div>
        ))}
        {!loading && restaurants.length === 0 && (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
}
