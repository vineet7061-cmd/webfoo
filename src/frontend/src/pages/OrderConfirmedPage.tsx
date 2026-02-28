import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function OrderConfirmedPage() {
  const { orderId } = useSearch({ from: "/order-confirmed" });

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, type: "spring", bounce: 0.3 }}
        className="text-center max-w-md w-full"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
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
          <h1 className="font-display font-extrabold text-4xl text-foreground mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Your order has been placed successfully. We'll have it delivered to
            you soon!
          </p>

          {orderId && (
            <div className="bg-secondary rounded-2xl p-5 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono font-bold text-foreground text-lg break-all">
                {orderId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link to="/" className="block">
              <Button
                size="lg"
                className="w-full text-white rounded-xl font-bold"
                style={{ backgroundColor: "#EA580C" }}
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
