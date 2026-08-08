import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import type { CartItem, ContactInfo, DeliveryMode } from "@/types/cart";

interface CartState {
  items: CartItem[];
  deliveryMode: DeliveryMode | null;
  contactInfo: ContactInfo | null;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  removeItem: (id: string) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  setContactInfo: (info: ContactInfo) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      deliveryMode: null,
      contactInfo: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      updateNotes: (id, notes) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, notes } : i)),
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setDeliveryMode: (deliveryMode) => set({ deliveryMode }),
      setContactInfo: (contactInfo) => set({ contactInfo }),
      clear: () => set({ items: [], deliveryMode: null, contactInfo: null }),
    }),
    { name: "camelia-cart" },
  ),
);

/** Guards against SSR/client hydration mismatches on persisted state (e.g. cart badge count). */
export function useCartHasHydrated() {
  return useSyncExternalStore(
    (callback) => useCartStore.persist.onFinishHydration(callback),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
