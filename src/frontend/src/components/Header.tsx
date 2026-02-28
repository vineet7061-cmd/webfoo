import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/assets/uploads/IMG_20260228_150053-1.jpg"
            alt="WebFoo Mart"
            className="h-12 w-12 object-cover rounded-full"
          />
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="hidden sm:block text-sm font-medium text-white">
              Cart
            </span>
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: "#06B6D4" }}
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
