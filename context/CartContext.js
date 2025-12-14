// context/CartContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  return context || {
    cart: [],
    cartCount: 0,
    cartTotal: 0,
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {}
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('antiqueCart');
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load cart');
          // If corrupted, clear it
          localStorage.removeItem('antiqueCart');
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('antiqueCart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (product) => {
    setCart(prev => {
      // Check if product already exists in cart using _id
      const existing = prev.find(item => item._id === product._id);
      
      if (existing) {
        // Update quantity for existing product
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new product with quantity 1
      return [...prev, { 
        ...product, 
        quantity: 1,
        // Ensure we have all necessary fields
        _id: product._id,
        id: product._id, // Also set id for backward compatibility
        name: product.name,
        price: product.price,
        picture: product.picture,
        brand: product.brand
      }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item._id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInitialized
    }}>
      {children}
    </CartContext.Provider>
  );
};