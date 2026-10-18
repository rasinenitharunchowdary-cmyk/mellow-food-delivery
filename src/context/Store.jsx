import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { calculateTotals, MAX_QUANTITY, sanitizeCart } from "../lib/commerce";

const Store = createContext(null);
export const STORAGE_KEY = "mellow.v1";
function initialState() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const orders = Array.isArray(data.orders)
      ? data.orders.filter(
          (o) =>
            o &&
            typeof o.id === "string" &&
            Number.isFinite(o.placedAt) &&
            o.address &&
            Number.isFinite(o.totals?.total) &&
            sanitizeCart(o.items).length === o.items?.length,
        )
      : [];
    return {
      cart: sanitizeCart(data.cart),
      orders: orders.slice(0, 100),
      favorites: Array.isArray(data.favorites)
        ? data.favorites.filter((x) => typeof x === "string")
        : [],
      location:
        typeof data.location === "string"
          ? data.location
          : "Indiranagar, Bengaluru",
      coupon: typeof data.coupon === "string" ? data.coupon : "",
    };
  } catch {
    return {
      cart: [],
      orders: [],
      favorites: [],
      location: "Indiranagar, Bengaluru",
      coupon: "",
    };
  }
}
function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const cart = action.replace ? [] : state.cart;
      const existing = cart.find((item) => item.key === action.item.key);
      return {
        ...state,
        coupon: action.replace ? "" : state.coupon,
        cart: existing
          ? cart.map((item) =>
              item.key === action.item.key
                ? {
                    ...item,
                    quantity: Math.min(
                      MAX_QUANTITY,
                      item.quantity + action.item.quantity,
                    ),
                  }
                : item,
            )
          : [...cart, action.item],
      };
    }
    case "QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.key === action.key
              ? { ...item, quantity: Math.min(MAX_QUANTITY, action.quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "REMOVE":
      return {
        ...state,
        cart: state.cart.filter((item) => item.key !== action.key),
      };
    case "COUPON":
      return { ...state, coupon: action.code };
    case "LOCATION":
      return { ...state, location: action.location };
    case "FAVORITE":
      return {
        ...state,
        favorites: state.favorites.includes(action.id)
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      };
    case "ORDER":
      return {
        ...state,
        orders: [action.order, ...state.orders].slice(0, 100),
        cart: [],
        coupon: "",
      };
    case "REORDER":
      return { ...state, cart: sanitizeCart(action.items), coupon: "" };
    case "ADVANCE":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.id
            ? { ...order, demoOffset: (order.demoOffset || 0) + action.seconds }
            : order,
        ),
      };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageFailed(false);
    } catch {
      setStorageFailed(true);
    }
  }, [state]);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(id);
    }
  }, [toast]);
  const totals = useMemo(
    () => calculateTotals(state.cart, state.coupon, state.orders.length),
    [state.cart, state.coupon, state.orders.length],
  );
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const value = {
    ...state,
    totals,
    count,
    dispatch,
    toast,
    notify: setToast,
    cartOpen,
    setCartOpen,
    storageFailed,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
export function useStore() {
  const value = useContext(Store);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
