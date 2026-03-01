// Local order storage utility
// Stores orders in localStorage to work around backend access control issues

const ORDERS_KEY = "webfoo_orders";

export interface LocalOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface LocalOrderDetail {
  id: string;
  status: string;
  total: number;
  username: string;
  address: string;
  timestamp: number;
  items: LocalOrderItem[];
}

export interface OrderDetailBigInt {
  id: string;
  status: string;
  total: bigint;
  username: string;
  address: string;
  timestamp: bigint;
  items: Array<{
    productId: bigint;
    productName: string;
    quantity: bigint;
    price: bigint;
  }>;
}

function loadOrders(): LocalOrderDetail[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalOrderDetail[];
  } catch {
    return [];
  }
}

function saveOrders(orders: LocalOrderDetail[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore storage errors
  }
}

export function saveOrderDetail(order: LocalOrderDetail): void {
  const orders = loadOrders();
  // Avoid duplicates
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.push(order);
  }
  saveOrders(orders);
}

export function getAllLocalOrders(): LocalOrderDetail[] {
  return loadOrders();
}

export function getLocalOrdersByUsername(username: string): LocalOrderDetail[] {
  return loadOrders().filter(
    (o) => o.username.toLowerCase() === username.toLowerCase(),
  );
}

export function updateLocalOrderStatus(orderId: string, status: string): void {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], status };
    saveOrders(orders);
  }
}

// Convert a LocalOrderDetail (number fields) back to the shape expected by the UI (bigint fields)
export function toOrderDetailBigInt(o: LocalOrderDetail): OrderDetailBigInt {
  return {
    id: o.id,
    status: o.status,
    total: BigInt(o.total),
    username: o.username,
    address: o.address,
    timestamp: BigInt(o.timestamp),
    items: o.items.map((item) => ({
      productId: BigInt(item.productId),
      productName: item.productName,
      quantity: BigInt(item.quantity),
      price: BigInt(item.price),
    })),
  };
}
