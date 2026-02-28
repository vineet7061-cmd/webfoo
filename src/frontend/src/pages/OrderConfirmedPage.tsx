import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Home, Package } from "lucide-react";
import { motion } from "motion/react";

export function OrderConfirmedPage() {
  const { orderId } = useSearch({ from: "/order-confirmed" });

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Background card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, type: "spring", bounce: 0.25 }}
          className="bg-white rounded-3xl shadow-card p-8 text-center relative overflow-hidden"
        >
          {/* Subtle top gradient */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
            style={{
              background: "linear-gradient(90deg, #06B6D4, #0891B2)",
            }}
          />

          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <CheckCircle2 className="w-14 h-14" style={{ color: "#16A34A" }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground mb-3">
              Order Confirmed! 🎉
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
              Your order has been placed successfully. We'll have it delivered
              to you soon!
            </p>

            {orderId && (
              <div
                className="rounded-2xl p-4 mb-7 text-left"
                style={{
                  backgroundColor: "#F0FDFA",
                  border: "1px solid #CCFBF1",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4" style={{ color: "#0891B2" }} />
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "#0891B2" }}
                  >
                    Order ID
                  </p>
                </div>
                <p className="font-mono font-bold text-foreground text-sm break-all">
                  {orderId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/" className="block">
                <Button
                  size="lg"
                  className="w-full text-white rounded-xl font-bold"
                  style={{ backgroundColor: "#0891B2" }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Confetti-style floating text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Thank you for shopping with{" "}
          <span className="font-semibold" style={{ color: "#0891B2" }}>
            WebFoo Mart
          </span>
          ! ✨
        </motion.p>
      </div>
    </main>
  );
}
