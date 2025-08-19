/**
 * Cart context to manage cart operations with backend.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

// PUBLIC_INTERFACE
export const CartContext = createContext(null);

/** PUBLIC_INTERFACE
 * Provides cart state and actions to the app.
 */
export function CartProvider({ children }) {
  /** Manages cart by calling backend endpoints. */
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getCart();
      // assume data has items array
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // PUBLIC_INTERFACE
  const addItem = async ({ menu_item_id, quantity = 1, special_instructions }) => {
    await api.addCartItem({ menu_item_id, quantity, special_instructions });
    await loadCart();
  };

  // PUBLIC_INTERFACE
  const updateItem = async (itemId, payload) => {
    await api.updateCartItem(itemId, payload);
    await loadCart();
  };

  // PUBLIC_INTERFACE
  const removeItem = async (itemId) => {
    await api.removeCartItem(itemId);
    await loadCart();
  };

  // PUBLIC_INTERFACE
  const clear = async () => {
    await api.clearCart();
    await loadCart();
  };

  // PUBLIC_INTERFACE
  const checkout = async () => {
    const res = await api.checkout();
    await loadCart();
    return res;
  };

  const value = useMemo(() => ({
    items,
    loading,
    addItem,
    updateItem,
    removeItem,
    clear,
    checkout,
    reload: loadCart,
  }), [items, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export const useCart = () => useContext(CartContext);
