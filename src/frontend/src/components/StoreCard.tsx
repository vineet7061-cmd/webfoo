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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        to="/store/$storeId"
        params={{ storeId: store.id.toString() }}
        className="group block h-full"
      >
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1.5">
          {/* Bold colored header band */}
          <div
            className="relative flex items-center justify-center py-7 overflow-hidden flex-shrink-0"
            style={{ backgroundColor: style.bg }}
          >
            {/* Background texture circles */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full opacity-10"
              style={{ backgroundColor: "white" }}
            />
            {/* Big emoji */}
            <span className="text-5xl relative z-10 drop-shadow-sm select-none">
              {style.emoji}
            </span>
          </div>

          {/* Card body */}
          <div className="p-4 flex flex-col flex-1">
            {/* Store name */}
            <h3 className="font-display font-bold text-base text-foreground mb-1 line-clamp-1 leading-snug">
              {store.name}
            </h3>

            {/* Category label */}
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: style.bg }}
            >
              {store.category}
            </p>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {store.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
