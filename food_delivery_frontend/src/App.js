import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import CartPage from './pages/CartPage';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <NavBar />
      <div style={{ paddingTop: 60 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/login" element={<LoginRedirectIfAuthed><Login /></LoginRedirectIfAuthed>} />
          <Route path="/register" element={<LoginRedirectIfAuthed><Register /></LoginRedirectIfAuthed>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  /** Protects a route, redirecting to login if unauthenticated. */
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="container"><p>Loading...</p></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function LoginRedirectIfAuthed({ children }) {
  /** Redirect to home if already authenticated. */
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="container"><p>Loading...</p></div>;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// PUBLIC_INTERFACE
function AppWithProviders() {
  /** Root wrapper that provides Auth and Cart contexts within Router. */
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppWithProviders;
