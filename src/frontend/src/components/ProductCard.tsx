import type { Product } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice, getCategoryStyle } from "@/utils/categoryColors";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group"
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.id.toString() }}
        className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group-hover:-translate-y-1 group-hover:scale-[1.01]"
      >
        {/* Product image zone */}
        <div
          className="h-40 sm:h-44 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${style.bg} 0%, ${style.lightBg} 100%)`,
          }}
        >
          <span className="text-5xl sm:text-6xl drop-shadow-md select-none relative z-10">
            {style.emoji}
          </span>
          {/* Price overlay */}
          <div
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm"
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(6px)",
            }}
          >
            {formatPrice(product.price)}
          </div>
          {/* Decorative orb */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
            style={{ backgroundColor: "white" }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-xs sm:text-sm text-foreground mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="w-full text-white rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: style.bg }}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
