import type { Product } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import {
  EXTRA_STORES,
  useGetAllStores,
  useGetProduct,
  useGetReviews,
} from "@/hooks/useQueries";
import { formatPrice, getCategoryStyle } from "@/utils/categoryColors";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          style={{
            fill: star <= rating ? "#F59E0B" : "transparent",
            color: star <= rating ? "#F59E0B" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
}

export function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const productIdBig = BigInt(productId);
  const storeKey = Math.floor(Number(productIdBig) / 100).toString();

  // Find product: first check sample data (frontend stores), then backend
  const sampleProduct: Product | undefined = useMemo(() => {
    const storeProducts = SAMPLE_PRODUCTS[storeKey];
    return storeProducts?.find((p) => p.id === productIdBig);
  }, [productIdBig, storeKey]);

  const { data: backendProduct, isLoading: productLoading } =
    useGetProduct(productIdBig);
  const { data: reviews, isLoading: reviewsLoading } =
    useGetReviews(productIdBig);
  const { data: allStores } = useGetAllStores();

  const product = sampleProduct ?? backendProduct;

  const store = useMemo(() => {
    if (!product) return null;
    const stores = allStores ?? EXTRA_STORES;
    return stores.find((s) => s.id === product.storeId);
  }, [product, allStores]);

  const style = store ? getCategoryStyle(store.category) : null;
  const isLoading = !sampleProduct && productLoading;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      storeId: product.storeId,
      quantity,
    });
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity}× ${formatPrice(product.price)} each`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      storeId: product.storeId,
      quantity,
    });
    navigate({ to: "/checkout" });
  };

  if (!isLoading && !product) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="font-display font-bold text-2xl mb-2">
          Product not found
        </h2>
        <Link to="/" className="text-primary underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="text-border">/</span>
        {store && (
          <>
            <Link
              to="/store/$storeId"
              params={{ storeId: store.id.toString() }}
              className="hover:text-foreground transition-colors"
            >
              {store.name}
            </Link>
            <span className="text-border">/</span>
          </>
        )}
        <span className="text-foreground font-medium truncate max-w-xs">
          {isLoading ? "Loading..." : product?.name}
        </span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product image */}
        {isLoading ? (
          <Skeleton className="rounded-3xl aspect-square w-full max-w-sm mx-auto" />
        ) : style ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl aspect-square w-full max-w-sm mx-auto flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${style.bg} 0%, ${style.lightBg} 100%)`,
            }}
          >
            <span className="text-[120px] select-none relative z-10">
              {style.emoji}
            </span>
            {/* Decorative circles */}
            <div
              className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-15"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute bottom-10 left-10 w-16 h-16 rounded-full opacity-10"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        ) : null}

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col"
        >
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : product && style ? (
            <>
              {/* Back link */}
              {store && (
                <Link
                  to="/store/$storeId"
                  params={{ storeId: store.id.toString() }}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {store.name}
                </Link>
              )}

              {/* Category badge */}
              {store && (
                <span
                  className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{
                    backgroundColor: style.badge,
                    color: style.badgeText,
                  }}
                >
                  {style.emoji} {store.category}
                </span>
              )}

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground leading-tight mb-4">
                {product.name}
              </h1>

              <div
                className="font-display font-bold text-4xl mb-5"
                style={{ color: "#0891B2" }}
              >
                {formatPrice(product.price)}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-7 text-sm sm:text-base">
                {product.description}
              </p>

              <Separator className="mb-6" />

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-foreground text-sm">
                  Qty
                </span>
                <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-base text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="flex-1 text-white rounded-xl font-bold text-sm py-3 h-12"
                  style={{ backgroundColor: "#0891B2" }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl font-bold text-sm py-3 h-12 border-2"
                  style={{ borderColor: "#0891B2", color: "#0891B2" }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Shipping notice */}
              <div className="mt-5 p-4 bg-accent rounded-xl text-sm text-muted-foreground flex items-start gap-2">
                <span>🚚</span>
                <span>
                  Free shipping on orders over $50 · Flat $4.99 shipping
                  otherwise
                </span>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      {/* ─── Reviews ─── */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">
          Customer Reviews
        </h2>

        {reviewsLoading ? (
          <div className="space-y-4">
            {["a", "b", "c"].map((k) => (
              <div key={k} className="p-5 bg-white rounded-2xl shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={`${review.reviewer}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-5 bg-white rounded-2xl shadow-card"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: style?.bg ?? "#0891B2" }}
                    >
                      {review.reviewer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {review.reviewer}
                      </p>
                      <StarRating rating={Number(review.rating)} />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary rounded-2xl">
            <div className="text-4xl mb-3">⭐</div>
            <p className="font-semibold text-foreground mb-1">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
