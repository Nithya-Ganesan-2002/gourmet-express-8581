import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const load = async () => {
    try {
      const data = await api.getOrder(id);
      setOrder(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
    intervalRef.current = setInterval(load, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!order) return <div className="container"><p>Order not found.</p></div>;

  const currentIndex = STATUS_STEPS.indexOf(order.status);
  return (
    <div className="container">
      <h2>Order #{order.id || order._id}</h2>
      <p>Status: <strong>{order.status}</strong></p>
      <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
        {STATUS_STEPS.map((s, idx) => (
          <div key={s} style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            background: idx <= currentIndex ? 'var(--bg-secondary)' : 'transparent',
            opacity: idx <= currentIndex ? 1 : 0.5
          }}>
            {s.replaceAll('_', ' ')}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Summary</h3>
        <p>Placed at: {order.created_at || order.createdAt}</p>
        <p>Total: ${order.total?.toFixed?.(2) ?? order.total}</p>
      </div>
    </div>
  );
}
