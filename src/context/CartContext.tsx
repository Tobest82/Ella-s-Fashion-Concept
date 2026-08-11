import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity?: number) => void;
  updateQuantity: (index: number, newQty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'efc_shopping_cart_v1';
const WISHLIST_STORAGE_KEY = 'efc_wishlist_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart', e);
      try {
        const slimCart = cart.map(item => ({
          ...item,
          product: {
            ...item.product,
            images: item.product.images.map(img => typeof img === 'string' && img.startsWith('data:') ? 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80' : img)
          }
        }));
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(slimCart));
      } catch (fallbackErr) {
        console.warn('Fallback cart storage write error', fallbackErr);
      }
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [wishlist]);

  const addToCart = (product: Product, size: string, color: { name: string; hex: string }, quantity = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
