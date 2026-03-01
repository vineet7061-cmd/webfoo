import type { Product } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice, getCategoryStyle } from "@/utils/categoryColors";
import { Link } from "@tanstack/react-router";
import { Eye, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product & { outOfStock?: boolean };
  category: string;
  index?: number;
}

export function ProductCard({
  product,
  category,
  index = 0,
}: ProductCardProps) {
  const style = getCategoryStyle(category);
  const { addItem } = useCart();

  const isOutOfStock = !!(product as any).outOfStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      storeId: product.storeId,
    });
    toast.success(`${product.name} added to cart!`, {
      description: formatPrice(product.price),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.id.toString() }}
        className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group-hover:-translate-y-1.5"
      >
        {/* Product image zone */}
        <div
          className="h-36 sm:h-44 flex items-center justify-center relative overflow-hidden"
          style={
            !(product as any).imageUrl
              ? {
                  background: `linear-gradient(145deg, ${style.bg} 0%, ${style.bg}cc 60%, ${style.lightBg} 100%)`,
                }
              : undefined
          }
        >
          {(product as any).imageUrl ? (
            <img
              src={(product as any).imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <span className="text-5xl sm:text-6xl drop-shadow-md select-none relative z-10">
                {style.emoji}
              </span>
              {/* Decorative orb */}
              <div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-20"
                style={{ backgroundColor: "white" }}
              />
            </>
          )}

          {/* Price tag */}
          <div
            className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-md z-10"
            style={{
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
            }}
          >
            {formatPrice(product.price)}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
              >
                Out of Stock
              </span>
            </div>
          )}

          {/* View detail overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold"
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              View Details
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-display font-semibold text-xs sm:text-sm text-foreground mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full text-white rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: isOutOfStock ? "#9CA3AF" : style.bg }}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
