import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/categoryColors";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const SHIPPING_CENTS = BigInt(499); // $4.99

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  const total = subtotal + (items.length > 0 ? SHIPPING_CENTS : BigInt(0));

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <h1 className="font-display font-extrabold text-3xl text-foreground mb-8">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#FFF7ED" }}
          >
            <ShoppingBag className="w-12 h-12" style={{ color: "#EA580C" }} />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything yet. Start shopping!
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="text-white rounded-xl px-8 font-bold"
              style={{ backgroundColor: "#EA580C" }}
            >
              Browse Stores
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.productId.toString()}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-card p-4 sm:p-5"
                >
                  <div className="flex items-start gap-4">
                    {/* Color dot */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: "#FFF7ED" }}
                    >
                      🛍️
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground line-clamp-1 mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {formatPrice(item.price)} each
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-foreground">
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

            {/* Continue shopping */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
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
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {formatPrice(SHIPPING_CENTS)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: "#EA580C" }}>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate({ to: "/checkout" })}
                size="lg"
                className="w-full text-white rounded-xl font-bold"
                style={{ backgroundColor: "#EA580C" }}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
