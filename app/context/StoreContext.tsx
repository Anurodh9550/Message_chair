"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  img: string;
  price: number;
};

type CartItem = Product & {
  quantity: number;
};

type User = {
  name: string;
  email: string;
};

type StoreContextValue = {
  user: User | null;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const USER_KEY = "kila_user";
const CART_KEY = "kila_cart";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const rawUser = localStorage.getItem(USER_KEY);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const rawCart = localStorage.getItem(CART_KEY);
    return rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const login = (email: string, password: string) => {
    if (!email || !password) {
      return { ok: false, message: "Email and password required." };
    }
    const name = email.split("@")[0];
    setUser({ name, email });
    return { ok: true, message: "Login successful." };
  };

  const logout = () => {
    setUser(null);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );

  const value: StoreContextValue = {
    user,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    login,
    logout,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
