// Local stores/products storage utility
// Stores admin-added stores and products in localStorage
// since the backend doesn't expose addStore/addProduct/updateStore/updateProduct

const LOCAL_STORES_KEY = "webfoo_local_stores";
const LOCAL_PRODUCTS_KEY = "webfoo_local_products";

// IDs for local stores start at 100 (to avoid conflict with backend stores 1-12)
// IDs for local products start at 10000 (to avoid conflict with backend products)
const LOCAL_STORE_ID_START = 100;
const LOCAL_PRODUCT_ID_START = 10000;

export interface LocalStore {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
}

export interface LocalProduct {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  outOfStock?: boolean;
}

// ─── Stores ──────────────────────────────────────────────────────────────────

function loadLocalStores(): LocalStore[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalStore[];
  } catch {
    return [];
  }
}

function saveLocalStores(stores: LocalStore[]): void {
  try {
    localStorage.setItem(LOCAL_STORES_KEY, JSON.stringify(stores));
  } catch {
    // ignore storage errors
  }
}

function getNextStoreId(): number {
  const stores = loadLocalStores();
  if (stores.length === 0) return LOCAL_STORE_ID_START;
  return Math.max(...stores.map((s) => s.id)) + 1;
}

export function getAllLocalStores(): LocalStore[] {
  return loadLocalStores();
}

export function addLocalStore(data: Omit<LocalStore, "id">): LocalStore {
  const stores = loadLocalStores();
  const newStore: LocalStore = { id: getNextStoreId(), ...data };
  stores.push(newStore);
  saveLocalStores(stores);
  return newStore;
}

export function updateLocalStore(
  id: number,
  data: Omit<LocalStore, "id">,
): void {
  const stores = loadLocalStores();
  const idx = stores.findIndex((s) => s.id === id);
  if (idx >= 0) {
    stores[idx] = { id, ...data };
    saveLocalStores(stores);
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

function loadLocalProducts(): LocalProduct[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalProduct[];
  } catch {
    return [];
  }
}

function saveLocalProducts(products: LocalProduct[]): void {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // ignore storage errors
  }
}

function getNextProductId(): number {
  const products = loadLocalProducts();
  if (products.length === 0) return LOCAL_PRODUCT_ID_START;
  return Math.max(...products.map((p) => p.id)) + 1;
}

export function getLocalProductsByStore(storeId: number): LocalProduct[] {
  return loadLocalProducts().filter((p) => p.storeId === storeId);
}

export function getAllLocalProducts(): LocalProduct[] {
  return loadLocalProducts();
}

export function addLocalProduct(data: Omit<LocalProduct, "id">): LocalProduct {
  const products = loadLocalProducts();
  const newProduct: LocalProduct = { id: getNextProductId(), ...data };
  products.push(newProduct);
  saveLocalProducts(products);
  return newProduct;
}

export function updateLocalProduct(
  id: number,
  data: Omit<LocalProduct, "id">,
): void {
  const products = loadLocalProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    products[idx] = { id, ...data };
    saveLocalProducts(products);
  }
}

export function deleteLocalStore(id: number): void {
  const stores = loadLocalStores();
  saveLocalStores(stores.filter((s) => s.id !== id));
}

export function deleteLocalProduct(id: number): void {
  const products = loadLocalProducts();
  saveLocalProducts(products.filter((p) => p.id !== id));
}

export function toggleLocalProductOutOfStock(id: number): boolean {
  const products = loadLocalProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    products[idx] = {
      ...products[idx],
      outOfStock: !products[idx].outOfStock,
    };
    saveLocalProducts(products);
    return !!products[idx].outOfStock;
  }
  return false;
}
