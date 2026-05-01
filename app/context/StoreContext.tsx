"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "../utils/apiBase";

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
  id: number;
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
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message: string }>;
  forgotPassword: (
    email: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const USER_KEY = "kila_user";
const CART_KEY = "kila_cart";
const API_BASE = getApiBaseUrl();

const getAuthApiBases = (): string[] => {
  const bases = [API_BASE];
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    bases.push("http://127.0.0.1:8000/api", "http://localhost:8000/api");
  }
  return Array.from(new Set(bases.map((item) => item.replace(/\/$/, ""))));
};

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

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return { ok: false, message: "Email and password required." };
    }

    let lastNetworkError = false;
    for (const base of getAuthApiBases()) {
      try {
        const response = await fetch(`${base}/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const payload = (await response.json()) as
          | User
          | {
              detail?: string;
            };

        if (!response.ok) {
          return {
            ok: false,
            message:
              "detail" in payload && payload.detail
                ? payload.detail
                : "Login failed. Please check credentials.",
          };
        }

        setUser(payload as User);
        return { ok: true, message: "Login successful." };
      } catch {
        lastNetworkError = true;
      }
    }
    return {
      ok: false,
      message: lastNetworkError ? "Unable to connect to server." : "Login failed.",
    };
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      return { ok: false, message: "Name, email and password are required." };
    }
    let lastNetworkError = false;
    for (const base of getAuthApiBases()) {
      try {
        const response = await fetch(`${base}/auth/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const payload = (await response.json()) as
          | User
          | {
              email?: string[];
              password?: string[];
              detail?: string;
            };

        if (!response.ok) {
          const errorMessage =
            ("email" in payload && payload.email?.[0]) ||
            ("password" in payload && payload.password?.[0]) ||
            ("detail" in payload && payload.detail) ||
            "Registration failed.";
          return { ok: false, message: errorMessage };
        }

        setUser(payload as User);
        return { ok: true, message: "Registration successful." };
      } catch {
        lastNetworkError = true;
      }
    }
    return {
      ok: false,
      message: lastNetworkError ? "Unable to connect to server." : "Registration failed.",
    };
  };

  const logout = () => {
    setUser(null);
  };

  const forgotPassword = async (
    email: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    if (!email || !newPassword || !confirmPassword) {
      return { ok: false, message: "All fields are required." };
    }
    let lastNetworkError = false;
    for (const base of getAuthApiBases()) {
      try {
        const response = await fetch(`${base}/auth/forgot-password/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        });
        const payload = (await response.json()) as {
          detail?: string;
          confirm_password?: string[];
        };
        if (!response.ok) {
          return {
            ok: false,
            message:
              payload.confirm_password?.[0] ||
              payload.detail ||
              "Password reset failed.",
          };
        }
        return { ok: true, message: payload.detail || "Password reset successful." };
      } catch {
        lastNetworkError = true;
      }
    }
    return {
      ok: false,
      message: lastNetworkError ? "Unable to connect to server." : "Password reset failed.",
    };
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
    register,
    forgotPassword,
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
