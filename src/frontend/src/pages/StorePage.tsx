import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type StoreWithImage,
  useGetAllStores,
  useGetProductsByStore,
} from "@/hooks/useQueries";
import { getCategoryStyle } from "@/utils/categoryColors";
import { getAllLocalStores } from "@/utils/localStores";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

export function StorePage() {
  const { storeId } = useParams({ from: "/store/$storeId" });
  const storeIdBig = BigInt(storeId);
  const storeIdNum = Number(storeIdBig);

  const { data: allStores, isLoading: storesLoading } = useGetAllStores();
  const { data: products, isLoading: productsLoading } =
    useGetProductsByStore(storeIdBig);

  const store: StoreWithImage | undefined = useMemo(() => {
    if (allStores) {
      const found = allStores.find((s) => s.id === storeIdBig);
      if (found) return found;
    }
    // Fallback: check localStorage for admin-added stores
    if (storeIdNum >= 100) {
      const localStore = getAllLocalStores().find((s) => s.id === storeIdNum);
      if (localStore) {
        return {
          id: BigInt(localStore.id),
          name: localStore.name,
          description: localStore.description,
          category: localStore.category,
          imageUrl: localStore.imageUrl,
        };
      }
    }
    return undefined;
  }, [allStores, storeIdBig, storeIdNum]);

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
      {/* Store banner header */}
      {isLoading ? (
        <div className="h-44 bg-muted animate-pulse" />
      ) : store && style ? (
        <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${style.bg} 0%, ${style.bg}cc 55%, ${style.lightBg} 100%)`,
          }}
        >
          {/* Background texture orbs */}
          <div
            className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: "white" }}
          />
          <div
            className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full opacity-[0.08]"
            style={{ backgroundColor: "white" }}
          />
          {/* Inner glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-opacity hover:opacity-75"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              All Stores
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-5"
            >
              {/* Store icon */}
              {store.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt={store.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover flex-shrink-0 shadow-lg"
                  style={{ border: "2px solid rgba(255,255,255,0.4)" }}
                />
              ) : (
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-lg"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.22)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {style.emoji}
                </div>
              )}

              <div>
                {/* Category badge */}
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 uppercase tracking-wide"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.28)",
                    color: "white",
                  }}
                >
                  {store.category}
                </span>

                <h1
                  className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2"
                  style={{ color: "white" }}
                >
                  {store.name}
                </h1>
                <p
                  className="max-w-lg text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.78)" }}
                >
                  {store.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* Products grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
              >
                <Skeleton className="h-44 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1.5" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
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
            <div className="flex items-center gap-2 mb-6">
              <p className="text-sm font-medium text-muted-foreground">
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
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
