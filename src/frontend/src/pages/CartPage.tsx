import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatPrice, getCategoryStyle } from "@/utils/categoryColors";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const SHIPPING_CENTS = BigInt(499); // $4.99

// Map common product ID ranges to categories for icon display
function getItemEmoji(storeId: bigint): string {
  const id = Number(storeId);
  const emojiMap: Record<number, string> = {
    1: "🏪",
    2: "🌸",
    3: "🍫",
    4: "🛒",
    5: "🥦",
    6: "🥐",
    7: "🧸",
    8: "📚",
    9: "💊",
    10: "🐾",
    11: "⚡",
    12: "👗",
  };
  return emojiMap[id] ?? "🛍️";
}

function getItemColor(storeId: bigint): string {
  const id = Number(storeId);
  const categoryNames: Record<number, string> = {
    1: "General Store",
    2: "Flower Store",
    3: "Chocolate Store",
    4: "Grocery Store",
    5: "Vegetable Store",
    6: "Bakery",
    7: "Toy Store",
    8: "Bookstore",
    9: "Pharmacy",
    10: "Pet Store",
    11: "Electronics",
    12: "Clothing",
  };
  const style = getCategoryStyle(categoryNames[id] ?? "General Store");
  return style.lightBg;
}

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  const shipping = items.length > 0 ? SHIPPING_CENTS : BigInt(0);
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen">
      {/* Header strip */}
      <div
        className="border-b border-border"
        style={{
          background: "linear-gradient(135deg, #0a1520 0%, #0c2233 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(6,182,212,0.2)" }}
          >
            <ShoppingBag className="w-5 h-5" style={{ color: "#06B6D4" }} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight">
              Your Cart
            </h1>
            {items.length > 0 && (
              <p className="text-xs text-white/50">
                {items.reduce((s, i) => s + i.quantity, 0)} item
                {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""} in
                your cart
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#ECFEFF" }}
            >
              <ShoppingBag className="w-12 h-12" style={{ color: "#06B6D4" }} />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
              Looks like you haven&apos;t added anything yet. Browse our stores
              and start shopping!
            </p>
            <Link to="/">
              <Button
                size="lg"
                className="text-white rounded-xl px-8 font-bold shadow-md"
                style={{ backgroundColor: "#0891B2" }}
              >
                Browse Stores
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.productId.toString()}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                    className="bg-white rounded-2xl shadow-card p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Item icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: getItemColor(item.storeId) }}
                      >
                        {getItemEmoji(item.storeId)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground line-clamp-1 mb-1 text-sm sm:text-base">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {formatPrice(item.price)} each
                        </p>

                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground text-sm sm:text-base">
                              {formatPrice(item.price * BigInt(item.quantity))}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg text-foreground mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      {items.reduce((s, i) => s + i.quantity, 0) === 1
                        ? "item"
                        : "items"}
                      )
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {items.length > 0 ? formatPrice(SHIPPING_CENTS) : "—"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span style={{ color: "#0891B2" }}>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate({ to: "/checkout" })}
                  size="lg"
                  className="w-full text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#0891B2" }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  🔒 Secure checkout · Free returns
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
