import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.myOrders();
      setOrders(Array.isArray(data) ? data : data?.orders || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      <div className="grid">
        {orders.map((o) => (
          <div key={o.id || o._id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div><strong>Order #{o.id || o._id}</strong></div>
                <div style={{ opacity: 0.8 }}>Status: {o.status}</div>
              </div>
              <Link className="btn" to={`/orders/${o.id || o._id}`}>Track</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
