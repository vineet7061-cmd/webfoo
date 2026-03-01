import type { Store } from "@/backend.d";
import { getCategoryStyle } from "@/utils/categoryColors";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
      transition={{
        duration: 0.38,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        to="/store/$storeId"
        params={{ storeId: store.id.toString() }}
        className="group block h-full"
      >
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1.5">
          {/* Colored header zone */}
          <div
            className="relative flex items-center justify-center py-6 sm:py-8 overflow-hidden flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, ${style.bg} 0%, ${style.bg}dd 100%)`,
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute -bottom-8 -left-4 w-16 h-16 rounded-full opacity-12"
              style={{ backgroundColor: "white" }}
            />
            {/* Subtle inner glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)",
              }}
            />
            {/* Emoji */}
            <span className="text-4xl sm:text-5xl relative z-10 drop-shadow-sm select-none">
              {style.emoji}
            </span>
          </div>

          {/* Card body */}
          <div
            className="p-3 sm:p-4 flex flex-col flex-1"
            style={{
              background: `linear-gradient(to bottom, ${style.lightBg} 0%, #ffffff 55%)`,
            }}
          >
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground mb-0.5 line-clamp-1 leading-snug">
              {store.name}
            </h3>
            <p
              className="text-xs font-bold mb-2 uppercase tracking-wide"
              style={{ color: style.bg }}
            >
              {store.category}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {store.description}
            </p>

            {/* Shop now hint */}
            <div
              className="mt-3 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1"
              style={{ color: style.bg }}
            >
              Shop now
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
