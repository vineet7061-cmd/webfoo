import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, Review, Store } from "../backend.d";
import {
  getAllLocalOrders,
  getLocalOrdersByUsername,
  saveOrderDetail,
  toOrderDetailBigInt,
  updateLocalOrderStatus,
} from "../utils/localOrders";
import {
  addLocalProduct,
  addLocalStore,
  deleteLocalProduct,
  deleteLocalStore,
  getAllLocalProducts,
  getAllLocalStores,
  getLocalProductsByStore,
  toggleLocalProductOutOfStock,
  updateLocalProduct,
  updateLocalStore,
} from "../utils/localStores";
import { useActor } from "./useActor";

// Extended types that include imageUrl and outOfStock
export type StoreWithImage = Store & { imageUrl?: string };
export type ProductWithImage = Product & {
  imageUrl?: string;
  outOfStock?: boolean;
};

/**
 * Returns: backend stores (1-12) + admin-added stores from localStorage (ids >= 100)
 * NEVER uses hardcoded EXTRA_STORES — all 12 stores come from the backend canister
 */
export function useGetAllStores() {
  const { actor, isFetching } = useActor();
  return useQuery<StoreWithImage[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      // Always include localStorage admin-added stores
      const localStores: StoreWithImage[] = getAllLocalStores().map((s) => ({
        id: BigInt(s.id),
        name: s.name,
        description: s.description,
        category: s.category,
        imageUrl: s.imageUrl ?? "",
      }));

      if (!actor) return localStores;

      try {
        const backendStores = await actor.getAllStores();
        const mappedStores: StoreWithImage[] = backendStores.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          imageUrl: "",
        }));
        return [...mappedStores, ...localStores];
      } catch {
        return localStores;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
}

/**
 * Returns products for the given store.
 * - Backend stores (ids 1-12): call actor.getProductsByStore + append any local admin-added products
 * - Local admin stores (ids >= 100): only from localStorage
 */
export function useGetProductsByStore(storeId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithImage[]>({
    queryKey: ["products", storeId.toString()],
    queryFn: async () => {
      const storeIdNum = Number(storeId);

      // Local products always appended (admin-added for this store)
      const localProds: ProductWithImage[] = getLocalProductsByStore(
        storeIdNum,
      ).map((p) => ({
        id: BigInt(p.id),
        storeId: BigInt(p.storeId),
        name: p.name,
        description: p.description,
        price: BigInt(p.price),
        imageUrl: p.imageUrl ?? "",
        outOfStock: p.outOfStock ?? false,
      }));

      // For admin-added local stores (id >= 100): only localStorage
      if (storeIdNum >= 100) {
        return localProds;
      }

      // For backend stores (ids 1-12): call the canister
      if (!actor) return localProds;

      try {
        const backendProds = await actor.getProductsByStore(storeId);
        const mappedBackend: ProductWithImage[] = backendProds.map((p) => ({
          id: p.id,
          storeId: p.storeId,
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: "",
        }));
        return [...mappedBackend, ...localProds];
      } catch {
        return localProds;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
}

/**
 * Returns a single product.
 * - For product IDs >= 10000: look up from localStorage (admin-added products)
 * - For product IDs < 10000: call actor.getProduct
 */
export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithImage | null>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      const idNum = Number(id);

      // Local admin-added products
      if (idNum >= 10000) {
        const allLocal = getAllLocalProducts();
        const found = allLocal.find((p) => p.id === idNum);
        if (!found) return null;
        return {
          id: BigInt(found.id),
          storeId: BigInt(found.storeId),
          name: found.name,
          description: found.description,
          price: BigInt(found.price),
          imageUrl: found.imageUrl ?? "",
          outOfStock: found.outOfStock ?? false,
        };
      }

      // Backend products
      if (!actor) return null;
      try {
        const product = await actor.getProduct(id);
        if (!product) return null;
        return {
          id: product.id,
          storeId: product.storeId,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: "",
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetReviews(productId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getReviews(productId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Returns orders for the given username — from localStorage only.
 * (Never calls backend getOrdersByUser to avoid any access issues)
 */
export function useGetOrdersByUser(username: string) {
  return useQuery({
    queryKey: ["orders", "user", username],
    queryFn: () => {
      if (!username.trim()) return [];
      return getLocalOrdersByUsername(username).map(toOrderDetailBigInt);
    },
    enabled: username.trim().length > 0,
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Returns ALL orders from localStorage (for admin panel).
 * NEVER calls backend getAllOrders() which traps for non-admin callers.
 */
export function useGetAllOrders() {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => {
      return getAllLocalOrders().map(toOrderDetailBigInt);
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Places an order via the backend canister AND saves to localStorage.
 * Dual-write ensures orders appear in both admin panel and My Orders.
 */
export function usePlaceOrderWithUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      username,
      productIds,
      quantities,
      address,
      items,
      totalCents,
    }: {
      username: string;
      productIds: bigint[];
      quantities: bigint[];
      address: string;
      items: Array<{
        productId: number;
        productName: string;
        quantity: number;
        price: number;
      }>;
      totalCents: number;
    }) => {
      let orderId: string;

      if (actor) {
        try {
          orderId = await actor.placeOrderWithUser(
            username,
            productIds,
            quantities,
            address,
          );
        } catch {
          // If backend fails, generate a local order ID
          orderId = `WFM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        }
      } else {
        orderId = `WFM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      }

      // Always save to localStorage
      saveOrderDetail({
        id: orderId,
        status: "Pending",
        total: totalCents,
        username,
        address,
        timestamp: Date.now(),
        items,
      });

      return orderId;
    },
  });
}

export function useAddStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      category,
      imageUrl,
    }: {
      name: string;
      description: string;
      category: string;
      imageUrl: string;
    }) => {
      return addLocalStore({ name, description, category, imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      category,
      imageUrl,
    }: {
      id: bigint;
      name: string;
      description: string;
      category: string;
      imageUrl: string;
    }) => {
      updateLocalStore(Number(id), { name, description, category, imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      storeId,
      name,
      description,
      price,
      imageUrl,
    }: {
      storeId: bigint;
      name: string;
      description: string;
      price: bigint;
      imageUrl: string;
    }) => {
      return addLocalProduct({
        storeId: Number(storeId),
        name,
        description,
        price: Number(price),
        imageUrl,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId.toString()],
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      storeId,
      name,
      description,
      price,
      imageUrl,
    }: {
      id: bigint;
      storeId: bigint;
      name: string;
      description: string;
      price: bigint;
      imageUrl: string;
    }) => {
      updateLocalProduct(Number(id), {
        storeId: Number(storeId),
        name,
        description,
        price: Number(price),
        imageUrl,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.id.toString()],
      });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      updateLocalOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      deleteLocalStore(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: bigint; storeId: bigint }) => {
      deleteLocalProduct(Number(id));
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.id.toString()],
      });
    },
  });
}

export function useToggleProductOutOfStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: bigint; storeId: bigint }) => {
      return toggleLocalProductOutOfStock(Number(id));
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products", variables.storeId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.id.toString()],
      });
    },
  });
}
