import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #EA580C 0%, #EC4899 100%)",
            }}
          >
            W
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            Web<span style={{ color: "#EA580C" }}>Foo</span>
          </span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            <span className="hidden sm:block text-sm font-medium text-foreground">
              Cart
            </span>
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: "#EA580C" }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
