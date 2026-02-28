import { StoreCard } from "@/components/StoreCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllStores } from "@/hooks/useQueries";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const HERO_EMOJIS = [
  "🛒",
  "🌸",
  "⚡",
  "🍫",
  "📚",
  "🥦",
  "🧸",
  "💊",
  "🐾",
  "👗",
];

export function HomePage() {
  const [search, setSearch] = useState("");
  const { data: stores, isLoading } = useGetAllStores();

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
            "linear-gradient(160deg, #0f1923 0%, #0c2233 50%, #0f1923 100%)",
        }}
      >
        {/* Decorative background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Floating emoji decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 pointer-events-none select-none opacity-10">
          {HERO_EMOJIS.map((emoji, i) => (
            <motion.span
              key={emoji}
              className="text-4xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-7"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "#06B6D4" }}
            >
              WebFoo Mart
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] mb-3">
              Your local marketplace
            </h1>
            <p className="text-base text-white/50 font-body">
              Delivering Desires...
            </p>
          </motion.div>

          {/* Prominent centered search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <div className="relative search-glow rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "#06B6D4" }}
              />
              <Input
                type="search"
                placeholder="Search stores, categories, products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-14 pr-5 h-14 text-base bg-transparent border-0 shadow-none rounded-2xl text-white placeholder:text-white/35 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </motion.div>

          {/* Store count pill */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex justify-center mt-4"
            >
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(6,182,212,0.15)",
                  color: "#67E8F9",
                  border: "1px solid rgba(6,182,212,0.25)",
                }}
              >
                {filteredStores.length}{" "}
                {filteredStores.length === 1 ? "store" : "stores"}{" "}
                {search ? "found" : "available"}
              </span>
            </motion.div>
          )}
        </div>

        {/* Wave separator */}
        <div className="relative h-8 overflow-hidden">
          <svg
            viewBox="0 0 1440 32"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full"
            fill="oklch(0.985 0.002 210)"
            aria-hidden="true"
          >
            <title>Wave decoration</title>
            <path d="M0,32 C360,0 1080,32 1440,0 L1440,32 Z" />
          </svg>
        </div>
      </section>

      {/* ─── Store Directory ─── */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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

          {/* Loading skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
            /* Store grid */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
