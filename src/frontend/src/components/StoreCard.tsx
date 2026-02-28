import type { Store } from "@/backend.d";
import { getCategoryStyle } from "@/utils/categoryColors";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

interface StoreCardProps {
  store: Store;
  index?: number;
}

export function StoreCard({ store, index = 0 }: StoreCardProps) {
  const style = getCategoryStyle(store.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.045 }}
      className="h-full"
    >
      <Link
        to="/store/$storeId"
        params={{ storeId: store.id.toString() }}
        className="group block h-full"
      >
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1 group-hover:scale-[1.01]">
          {/* Colored header zone */}
          <div
            className="relative flex items-center justify-center py-6 overflow-hidden flex-shrink-0"
            style={{ backgroundColor: style.bg }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute -bottom-8 -left-4 w-16 h-16 rounded-full opacity-10"
              style={{ backgroundColor: "white" }}
            />
            {/* Emoji */}
            <span className="text-4xl relative z-10 drop-shadow-sm select-none">
              {style.emoji}
            </span>
          </div>

          {/* Card body */}
          <div
            className="p-4 flex flex-col flex-1"
            style={{
              background: `linear-gradient(to bottom, ${style.lightBg} 0%, #ffffff 60%)`,
            }}
          >
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground mb-0.5 line-clamp-1 leading-snug">
              {store.name}
            </h3>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: style.bg }}
            >
              {store.category}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {store.description}
            </p>

            {/* "Shop now" hint */}
            <div
              className="mt-3 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: style.bg }}
            >
              Shop now →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
