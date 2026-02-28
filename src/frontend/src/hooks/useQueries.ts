import { useMutation, useQuery } from "@tanstack/react-query";
import type { Product, Review, Store } from "../backend.d";
import { useActor } from "./useActor";

// Extra frontend-only stores (ids 7-12)
export const EXTRA_STORES: Store[] = [
  {
    id: BigInt(7),
    name: "Toy Kingdom",
    description:
      "A magical world of toys and games for kids of all ages. From action figures to board games!",
    category: "Toy Store",
  },
  {
    id: BigInt(8),
    name: "The Book Nook",
    description:
      "Curated selection of bestsellers, classics, and hidden gems. Find your next great read.",
    category: "Bookstore",
  },
  {
    id: BigInt(9),
    name: "MediCare Pharmacy",
    description:
      "Your trusted neighborhood pharmacy with vitamins, wellness products, and healthcare essentials.",
    category: "Pharmacy",
  },
  {
    id: BigInt(10),
    name: "Paws & Claws",
    description:
      "Everything your beloved pets need — food, toys, accessories, and grooming supplies.",
    category: "Pet Store",
  },
  {
    id: BigInt(11),
    name: "TechZone",
    description:
      "Latest gadgets, electronics, and smart home devices at unbeatable prices.",
    category: "Electronics",
  },
  {
    id: BigInt(12),
    name: "Fashion Forward",
    description:
      "Trendy clothing and accessories for every style and occasion. Look your best!",
    category: "Clothing",
  },
];

export function useGetAllStores() {
  const { actor, isFetching } = useActor();
  return useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      if (!actor) return EXTRA_STORES;
      const backendStores = await actor.getAllStores();
      return [...backendStores, ...EXTRA_STORES];
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetProductsByStore(storeId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", storeId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      // Extra stores 7-12 are frontend-only; return empty products
      if (storeId >= BigInt(7)) return [];
      return actor.getProductsByStore(storeId);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
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
      return actor.getReviews(productId);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      productIds,
      quantities,
      address,
    }: {
      productIds: bigint[];
      quantities: bigint[];
      address: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.placeOrder(productIds, quantities, address);
    },
  });
}
