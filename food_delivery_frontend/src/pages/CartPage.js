import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, updateItem, removeItem, clear, checkout } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const total = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

  const onCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const res = await checkout();
    const id = res?.id || res?.order_id;
    if (id) navigate(`/orders/${id}`);
    else navigate('/orders');
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <div className="grid">
            {items.map((it) => (
              <div className="card" key={it.id || it.item_id}>
                <h4>{it.name}</h4>
                <div className="row" style={{ alignItems: 'center' }}>
                  <span>Qty:</span>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={it.quantity || 1}
                    onChange={(e) => updateItem(it.id || it.item_id, { quantity: Number(e.target.value) })}
                    style={{ width: 80 }}
                  />
                  <button className="btn btn-small" onClick={() => removeItem(it.id || it.item_id)}>Remove</button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>${(((it.price || 0) * (it.quantity || 0))).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Total: ${total.toFixed(2)}</strong>
              <div>
                <button className="btn btn-outline" onClick={clear} style={{ marginRight: 8 }}>Clear Cart</button>
                <button className="btn" onClick={onCheckout}>Checkout</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
