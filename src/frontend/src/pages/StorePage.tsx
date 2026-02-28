import type { Store } from "@/backend.d";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EXTRA_STORES,
  useGetAllStores,
  useGetProductsByStore,
} from "@/hooks/useQueries";
import { getCategoryStyle } from "@/utils/categoryColors";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

// Sample products for frontend-only stores (ids 7-12)
import { SAMPLE_PRODUCTS } from "@/data/sampleProducts";

export function StorePage() {
  const { storeId } = useParams({ from: "/store/$storeId" });
  const storeIdBig = BigInt(storeId);

  const { data: allStores, isLoading: storesLoading } = useGetAllStores();
  const { data: backendProducts, isLoading: productsLoading } =
    useGetProductsByStore(storeIdBig);

  const store: Store | undefined = useMemo(() => {
    if (allStores) return allStores.find((s) => s.id === storeIdBig);
    // Fallback to extra stores
    return EXTRA_STORES.find((s) => s.id === storeIdBig);
  }, [allStores, storeIdBig]);

  const products = useMemo(() => {
    if (storeIdBig >= BigInt(7)) {
      return SAMPLE_PRODUCTS[storeId] ?? [];
    }
    return backendProducts ?? [];
  }, [storeIdBig, storeId, backendProducts]);

  const isLoading = storesLoading || productsLoading;
  const style = store ? getCategoryStyle(store.category) : null;

  if (!isLoading && !store) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">🏪</div>
        <h2 className="font-display font-bold text-2xl mb-2">
          Store not found
        </h2>
        <Link to="/" className="text-primary underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Store header */}
      {isLoading ? (
        <div className="h-36 bg-muted animate-pulse" />
      ) : store && style ? (
        <div
          className="py-10 px-4 sm:px-6"
          style={{
            background: `linear-gradient(135deg, ${style.lightBg} 0%, white 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Stores
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-5"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: style.bg }}
              >
                {style.emoji}
              </div>
              <div>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
                  style={{
                    backgroundColor: style.badge,
                    color: style.badgeText,
                  }}
                >
                  {store.category}
                </span>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground leading-tight">
                  {store.name}
                </h1>
                <p className="text-muted-foreground mt-1 max-w-xl">
                  {store.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* Products grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <PackageOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              No products yet
            </h2>
            <p className="text-muted-foreground">
              This store is getting stocked up. Check back soon!
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  category={store?.category ?? "General Store"}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
