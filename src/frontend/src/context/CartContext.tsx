import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  productId: bigint;
  productName: string;
  price: bigint;
  storeId: bigint;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: bigint;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "webfoo_cart";

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((item) => ({
      ...item,
      productId: item.productId.toString(),
      price: item.price.toString(),
      storeId: item.storeId.toString(),
    })),
  );
}

function deserializeCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw) as Array<{
      productId: string;
      productName: string;
      price: string;
      storeId: string;
      quantity: number;
    }>;
    return parsed.map((item) => ({
      ...item,
      productId: BigInt(item.productId),
      price: BigInt(item.price),
      storeId: BigInt(item.storeId),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? deserializeCart(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
  }, [items]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = newItem.quantity ?? 1;
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.productId === newItem.productId,
        );
        if (existing) {
          return prev.map((item) =>
            item.productId === newItem.productId
              ? { ...item, quantity: item.quantity + qty }
              : item,
          );
        }
        return [...prev, { ...newItem, quantity: qty }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * BigInt(item.quantity),
    BigInt(0),
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
