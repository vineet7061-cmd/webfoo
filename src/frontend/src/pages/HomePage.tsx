import { StoreCard } from "@/components/StoreCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllStores } from "@/hooks/useQueries";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

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
      {/* Hero section — clean white, bold accent stripe on the left */}
      <div className="relative overflow-hidden bg-white border-b border-border">
        {/* Left vivid accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: "#EA580C" }}
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            {/* Eyebrow */}
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#EA580C" }}
            >
              Your local marketplace
            </p>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4 leading-[1.1] max-w-2xl">
              Everything you need,{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(90deg, #EA580C, #EC4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                one place.
              </span>
            </h1>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              Browse our curated marketplace — fresh produce, trending fashion,
              sweet treats, and a dozen more local stores.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="max-w-lg"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "#EA580C" }}
              />
              <Input
                type="search"
                placeholder="Search stores or categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 h-13 text-base rounded-2xl border-2 bg-white shadow-card focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  borderColor: search ? "#EA580C" : undefined,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative emoji row — right side, large screens only */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 opacity-[0.12] pointer-events-none select-none text-5xl">
          <span>🛒</span>
          <span>🌸</span>
          <span>⚡</span>
          <span>🍫</span>
          <span>📚</span>
        </div>
      </div>

      {/* Stores grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {search && (
          <p className="text-sm text-muted-foreground mb-6">
            {filteredStores.length === 0
              ? `No stores found for "${search}"`
              : `${filteredStores.length} store${filteredStores.length !== 1 ? "s" : ""} found`}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].map(
              (k) => (
                <div
                  key={k}
                  className="bg-white rounded-2xl shadow-card overflow-hidden"
                >
                  <Skeleton className="h-2 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-4 w-20 mb-3 rounded-full" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : filteredStores.length === 0 && search ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              No stores match your search
            </h2>
            <p className="text-muted-foreground">
              Try a different keyword or browse all stores.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStores.map((store, i) => (
              <StoreCard key={store.id.toString()} store={store} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
