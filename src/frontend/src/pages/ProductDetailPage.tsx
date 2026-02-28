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
      {(["1", "2", "3", "4", "5"] as const).map((k, i) => (
        <Star
          key={k}
          className="w-4 h-4"
          style={{
            fill: i < rating ? "#F59E0B" : "transparent",
            color: i < rating ? "#F59E0B" : "#D1D5DB",
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
      description: `${quantity}x ${formatPrice(product.price)} each`,
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        {store && (
          <>
            <Link
              to="/store/$storeId"
              params={{ storeId: store.id.toString() }}
              className="hover:text-foreground transition-colors"
            >
              {store.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate max-w-xs">
          {isLoading ? "Loading..." : product?.name}
        </span>
      </div>

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
            style={{ backgroundColor: style.lightBg }}
          >
            <span className="text-[120px] select-none">{style.emoji}</span>
            {/* Decorative elements */}
            <div
              className="absolute top-6 right-6 w-20 h-20 rounded-full opacity-25"
              style={{ backgroundColor: style.bg }}
            />
            <div
              className="absolute bottom-8 left-8 w-14 h-14 rounded-full opacity-15"
              style={{ backgroundColor: style.bg }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `radial-gradient(circle at 80% 80%, ${style.bg}22 0%, transparent 60%)`,
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
            </div>
          ) : product && style ? (
            <>
              {/* Back link */}
              {store && (
                <Link
                  to="/store/$storeId"
                  params={{ storeId: store.id.toString() }}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to {store.name}
                </Link>
              )}

              {/* Category badge */}
              {store && (
                <span
                  className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3"
                  style={{
                    backgroundColor: style.badge,
                    color: style.badgeText,
                  }}
                >
                  {store.category}
                </span>
              )}

              <h1 className="font-display font-extrabold text-3xl text-foreground leading-tight mb-4">
                {product.name}
              </h1>

              <div
                className="font-display font-bold text-4xl mb-5"
                style={{ color: style.bg }}
              >
                {formatPrice(product.price)}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              <Separator className="mb-6" />

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors"
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
                  className="flex-1 text-white rounded-xl font-bold text-base h-13 py-3"
                  style={{ backgroundColor: style.bg }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl font-bold text-base h-13 py-3 border-2"
                  style={{ borderColor: style.bg, color: style.bg }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Shipping info */}
              <div className="mt-6 p-4 bg-secondary rounded-xl text-sm text-muted-foreground">
                🚚 Free shipping on orders over $50 · Flat $4.99 shipping
                otherwise
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      {/* Reviews section */}
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
                      style={{ backgroundColor: style?.bg ?? "#EA580C" }}
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
            <p className="font-medium text-foreground mb-1">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
