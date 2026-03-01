import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useGetOrdersByUser } from "@/hooks/useQueries";
import { formatPrice } from "@/utils/categoryColors";
import { Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

// Timestamps from localStorage are in milliseconds (not nanoseconds)
function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  // If the value looks like nanoseconds (too large for ms), convert
  const date = ms > 1e15 ? new Date(ms / 1_000_000) : new Date(ms);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "delivered") {
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
      >
        {status}
      </span>
    );
  }
  if (normalized === "cancelled" || normalized === "failed") {
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
      >
        {status}
      </span>
    );
  }
  if (normalized === "shipped") {
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
      >
        {status}
      </span>
    );
  }
  if (normalized === "processing") {
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#EEF2FF", color: "#4F46E5" }}
      >
        {status}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: "rgba(6,182,212,0.15)", color: "#06B6D4" }}
    >
      {status}
    </span>
  );
}

function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-44" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function MyOrdersPage() {
  const navigate = useNavigate();
  const { currentUser, isInitializing } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isInitializing && !currentUser) {
      navigate({ to: "/login", search: { redirect: "/my-orders" } });
    }
  }, [currentUser, isInitializing, navigate]);

  const username = currentUser?.username ?? "";
  const {
    data: orders,
    isLoading,
    refetch,
    isRefetching,
  } = useGetOrdersByUser(username);

  if (!currentUser && !isInitializing) return null;

  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <main className="min-h-screen">
      {/* Header strip */}
      <div
        className="border-b border-white/10"
        style={{
          background: "linear-gradient(135deg, #0a1520 0%, #0c2233 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(6,182,212,0.2)" }}
          >
            <ClipboardList className="w-5 h-5" style={{ color: "#06B6D4" }} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight">
              My Orders
            </h1>
            {currentUser && (
              <p className="text-xs text-white/50">
                Orders for{" "}
                <span className="text-white/80 font-medium">
                  {currentUser.displayName}
                </span>
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="ml-auto border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-xl"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {["sk-a", "sk-b", "sk-c"].map((id) => (
              <OrderCardSkeleton key={id} />
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#ECFEFF" }}
            >
              <Package className="w-12 h-12" style={{ color: "#06B6D4" }} />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link to="/">
              <Button
                size="lg"
                className="text-white rounded-xl px-8 font-bold shadow-md"
                style={{ backgroundColor: "#0891B2" }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">
                {sortedOrders.length} order
                {sortedOrders.length !== 1 ? "s" : ""} found
              </span>
            </div>

            <AnimatePresence>
              {sortedOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  style={{ border: "1px solid rgba(6,182,212,0.1)" }}
                >
                  {/* Order header */}
                  <div
                    className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8fdff 0%, #ecfeff 100%)",
                      borderBottom: "1px solid rgba(6,182,212,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(6,182,212,0.15)" }}
                      >
                        <Package
                          className="w-4 h-4"
                          style={{ color: "#0891B2" }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm font-mono">
                          {order.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(order.timestamp)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order body */}
                  <div className="px-5 py-4">
                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Items Ordered
                      </p>
                      {order.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.productName}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-foreground">
                            <span className="font-medium text-[#0891B2]">
                              {Number(item.quantity)}×
                            </span>{" "}
                            {item.productName}
                          </span>
                          <span className="text-muted-foreground font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3" />

                    {/* Delivery address + total */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Delivery Address
                        </p>
                        <p className="text-sm text-foreground truncate">
                          {order.address}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Total
                        </p>
                        <p
                          className="text-lg font-bold"
                          style={{ color: "#0891B2" }}
                        >
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
