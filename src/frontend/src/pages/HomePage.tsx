import { StoreCard } from "@/components/StoreCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useGetAllStores } from "@/hooks/useQueries";
import { Search, Store } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export function HomePage() {
  const [search, setSearch] = useState("");
  const { data: stores, isLoading } = useGetAllStores();
  const { actor, isFetching } = useActor();
  const initialized = useRef(false);

  // Initialize backend data (seed stores/products) on first load
  useEffect(() => {
    if (actor && !isFetching && !initialized.current) {
      initialized.current = true;
      actor.initialize().catch((err) => {
        // Silently ignore initialization errors (backend may already be seeded)
        console.debug("Initialize skipped:", err);
      });
    }
  }, [actor, isFetching]);

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    const q = search.toLowerCase().trim();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }, [stores, search]);

  return (
    <main className="min-h-screen">
      {/* ─── Hero Search Section ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0a1520 0%, #0c2233 45%, #071520 100%)",
        }}
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(6,182,212,0.14) 0%, transparent 65%)",
          }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #06B6D4 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "#22D3EE" }}
            >
              WebFoo Mart · Delivering Desires
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] mb-3">
              Your local marketplace,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #06B6D4, #22D3EE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                delivered
              </span>
            </h1>
            <p className="text-sm text-white/45 font-body max-w-sm mx-auto">
              Browse 12 curated stores — from fresh groceries to electronics
            </p>
          </motion.div>

          {/* Prominent centered search bar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative search-glow rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] transition-all duration-300">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "#06B6D4" }}
              />
              <Input
                type="search"
                placeholder="Search stores, categories, items…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-14 pr-5 h-14 text-base bg-transparent border-0 shadow-none rounded-2xl text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </motion.div>

          {/* Store count pill */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="flex justify-center mt-4"
            >
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(6,182,212,0.12)",
                  color: "#67E8F9",
                  border: "1px solid rgba(6,182,212,0.22)",
                }}
              >
                <Store className="w-3.5 h-3.5" />
                {filteredStores.length}{" "}
                {filteredStores.length === 1 ? "store" : "stores"}{" "}
                {search ? "found" : "available"}
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom fade edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(245,248,252,0.6))",
          }}
        />
      </section>

      {/* ─── Store Directory ─── */}
      <section className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {search ? "Search Results" : "Store Directory"}
              </p>
              {!search && (
                <h2 className="font-display font-bold text-xl text-foreground">
                  Browse all stores
                </h2>
              )}
            </div>
          </div>

          {/* No results */}
          {!isLoading && search && filteredStores.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="font-display font-bold text-xl text-foreground mb-2">
                No stores found for &ldquo;{search}&rdquo;
              </h2>
              <p className="text-muted-foreground text-sm">
                Try a different keyword or clear the search to browse all
                stores.
              </p>
            </motion.div>
          )}

          {/* Loading skeletons — strict 2-column */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map(
                (k) => (
                  <div
                    key={k}
                    className="bg-white rounded-2xl shadow-card overflow-hidden"
                  >
                    <Skeleton className="h-24 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-3.5 w-24 mb-3 rounded-full" />
                      <Skeleton className="h-4 w-full mb-1.5" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            /* Store grid — strict 2-column always */
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {filteredStores.map((store, i) => (
                <StoreCard key={store.id.toString()} store={store} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
