import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Top navigation bar with links and auth/cart indicators.
 * PUBLIC_INTERFACE
 */
export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Gourmet Express</Link>
        <Link to="/restaurants" className="nav-link">Restaurants</Link>
        {isAuthenticated && <Link to="/orders" className="nav-link">Orders</Link>}
      </div>
      <div className="nav-right">
        <Link to="/cart" className="nav-link">Cart ({cartCount})</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">Hi, {user?.full_name || user?.email}</Link>
            <button className="btn btn-small" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-small">Login</Link>
            <Link to="/register" className="btn btn-outline btn-small">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
