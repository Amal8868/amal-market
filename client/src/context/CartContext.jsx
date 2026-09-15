import React, { useState, useEffect } from 'react';
import { useAuth } from './auth';
import { CartContext } from './cart';
import toast from 'react-hot-toast';

const CartState = ({ children, userId }) => {
  const cartKey = `amal_cart_${userId}`;
  const wishKey = `amal_wishlist_${userId}`;

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWish = localStorage.getItem(wishKey);
    return savedWish ? JSON.parse(savedWish) : [];
  });

  // Save changes to user-specific keys
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  useEffect(() => {
    localStorage.setItem(wishKey, JSON.stringify(wishlist));
  }, [wishlist, wishKey]);

  // Cart Functions
  const addToCart = (product, qty = 1) => {
    const resolvedPrice = product.hasDiscount ? product.discountedPrice : product.price;
    const resolvedProduct = { ...product, price: resolvedPrice };

    if (resolvedProduct.stock !== undefined && resolvedProduct.stock <= 0) {
      toast.error(`🚨 ${resolvedProduct.name} is currently sold out`);
      return false;
    }

    const existingItem = cartItems.find(item => item.id === resolvedProduct.id);
    const totalRequested = (existingItem ? existingItem.quantity : 0) + qty;
      
    if (resolvedProduct.stock !== undefined && totalRequested > resolvedProduct.stock) {
      toast.error(`⚠️ Cannot add ${qty} more. Only ${resolvedProduct.stock} units available in stock.`);
      return false;
    }

    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === resolvedProduct.id);
      if (item) {
        return prevItems.map(i => i.id === resolvedProduct.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prevItems, { ...resolvedProduct, quantity: qty }];
    });
    
    toast.success(`🛒 Added to your cart!`);
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId, amount) => {
    const targetItem = cartItems.find(item => item.id === productId);
    if (!targetItem) return;

    if (amount > 0 && targetItem.stock !== undefined && (targetItem.quantity + amount) > targetItem.stock) {
      toast.error(`⚠️ Only ${targetItem.stock} units available in stock.`);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const inWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotal,
      wishlist,
      toggleWishlist,
      inWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? (user._id || user.email) : 'guest';

  return <CartState key={userId} userId={userId}>{children}</CartState>;
};
