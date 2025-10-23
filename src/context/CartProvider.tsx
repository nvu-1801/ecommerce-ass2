"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCart } from "@/app/actions/cart/getCart";
import { addToCart } from "@/app/actions/cart/addToCart";
import { updateCartItem } from "@/app/actions/cart/updateCartItem";
import { removeFromCart } from "@/app/actions/cart/removeFromCart";
import { clearCart as clearCartAction } from "@/app/actions/cart/clearCart";

export type CartItem = {
  id: string; // productId
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  cartItemId?: string; // ID của CartItem trong DB
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  isLoading: boolean;
  cartId: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity" | "cartItemId">, qty?: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate session ID for guest users
function getSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from database
  const loadCart = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Get userId from auth session
      const userId = undefined; // Replace with actual userId
      const sessionId = getSessionId();

      const cart = await getCart(userId || "", sessionId);

      if (cart) {
        setCartId(cart.id);
        setItems(cart.items);
      } else {
        setItems([]);
        setCartId(null);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }
  };

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const addItem = async (item: Omit<CartItem, "quantity" | "cartItemId">, qty = 1) => {
    try {
      // Optimistic update
      setItems((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) {
          return prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + qty } : p
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });

      // TODO: Get userId from auth
      const userId = undefined;
      const sessionId = getSessionId();

      const result = await addToCart({
        userId,
        sessionId,
        productId: item.id,
        quantity: qty,
      });

      if (result.success) {
        // Reload cart to get updated data with cartItemId
        await loadCart();
        setIsOpen(true);
      } else {
        // Revert on error
        await loadCart();
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add item error:", error);
      // Revert on error
      await loadCart();
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      // Optimistic update
      setItems((prev) => prev.filter((p) => p.cartItemId !== cartItemId));

      const result = await removeFromCart(cartItemId);

      if (!result.success) {
        // Revert on error
        await loadCart();
        console.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Remove item error:", error);
      await loadCart();
    }
  };

  const updateQuantity = async (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(cartItemId);
      return;
    }

    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((p) => (p.cartItemId === cartItemId ? { ...p, quantity: qty } : p))
      );

      const result = await updateCartItem({ cartItemId, quantity: qty });

      if (!result.success) {
        // Revert on error
        await loadCart();
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      await loadCart();
    }
  };

  const clearCart = async () => {
    if (!cartId) return;

    try {
      // Optimistic update
      setItems([]);

      const result = await clearCartAction(cartId);

      if (!result.success) {
        // Revert on error
        await loadCart();
        console.error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      await loadCart();
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((s, i) => s + i.quantity * i.price, 0),
    [items]
  );

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    isOpen,
    isLoading,
    cartId,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart: loadCart,
  };

  // Don't render until hydrated
  if (!isHydrated) {
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}