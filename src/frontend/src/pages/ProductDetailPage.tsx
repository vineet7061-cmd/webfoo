import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import {
  type ProductWithImage,
  type StoreWithImage,
  useGetAllStores,
  useGetProduct,
  useGetReviews,
} from "@/hooks/useQueries";
import { formatPrice, getCategoryStyle } from "@/utils/categoryColors";
import { getAllLocalProducts } from "@/utils/localStores";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
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

  const productIdNum = Number(productId);
  const productIdBig = BigInt(productId);
  const isLocalProduct = productIdNum >= 10000;

  // For local admin-added products, look up directly from localStorage
  const localProduct: ProductWithImage | null = useMemo(() => {
    if (!isLocalProduct) return null;
    const allLocal = getAllLocalProducts();
    const found = allLocal.find((p) => p.id === productIdNum);
    if (!found) return null;
    return {
      id: BigInt(found.id),
      storeId: BigInt(found.storeId),
      name: found.name,
      description: found.description,
      price: BigInt(found.price),
      imageUrl: found.imageUrl ?? "",
      outOfStock: found.outOfStock ?? false,
    };
  }, [isLocalProduct, productIdNum]);

  // Only call the backend hook for non-local products
  const { data: backendProduct, isLoading: backendLoading } =
    useGetProduct(productIdBig);

  const { data: reviews, isLoading: reviewsLoading } =
    useGetReviews(productIdBig);

  const { data: allStores } = useGetAllStores();

  // Final product: prefer local product if local, else backend
  const product: ProductWithImage | null | undefined = isLocalProduct
    ? localProduct
    : backendProduct;

  const isLoading = !isLocalProduct && backendLoading;

  const store: StoreWithImage | undefined = useMemo(() => {
    if (!product || !allStores) return undefined;
    return allStores.find((s) => s.id === product.storeId);
  }, [product, allStores]);

  const style = store
    ? getCategoryStyle(store.category)
    : product
      ? getCategoryStyle("General Store")
      : null;

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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
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

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Product image */}
        {isLoading ? (
          <Skeleton className="rounded-3xl aspect-square w-full max-w-md mx-auto" />
        ) : product?.imageUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl aspect-square w-full max-w-md mx-auto overflow-hidden shadow-lg"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : style ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl aspect-square w-full max-w-md mx-auto flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${style.bg} 0%, ${style.bg}cc 50%, ${style.lightBg} 100%)`,
            }}
          >
            <span className="text-[110px] sm:text-[130px] select-none relative z-10 drop-shadow-lg">
              {style.emoji}
            </span>
            {/* Decorative circles */}
            <div
              className="absolute top-8 right-8 w-28 h-28 rounded-full opacity-15"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute bottom-10 left-10 w-20 h-20 rounded-full opacity-10"
              style={{ backgroundColor: "white" }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle at 22% 22%, rgba(255,255,255,0.22) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        ) : null}

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
                  className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide"
                  style={{
                    backgroundColor: style.badge,
                    color: style.badgeText,
                  }}
                >
                  {style.emoji} {store.category}
                </span>
              )}

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
                  {product.name}
                </h1>
                {product.outOfStock && (
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex-shrink-0"
                    style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                  >
                    Out of Stock
                  </span>
                )}
              </div>

              <div
                className="font-display font-bold text-4xl mb-5"
                style={{ color: style.bg }}
              >
                {formatPrice(product.price)}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                {product.description}
              </p>

              <Separator className="mb-6" />

              {product.outOfStock ? (
                <div
                  className="rounded-xl p-4 mb-6 flex items-center gap-3"
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <span className="text-2xl">😔</span>
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#B91C1C" }}
                    >
                      Currently Unavailable
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This product is out of stock. Check back soon!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-semibold text-foreground text-sm">
                      Quantity
                    </span>
                    <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-11 text-center font-bold text-base text-foreground">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Subtotal:{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(product.price * BigInt(quantity))}
                      </span>
                    </span>
                  </div>
                </>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {/* Buy Now — primary CTA */}
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  disabled={!!product.outOfStock}
                  className="flex-1 text-white rounded-xl font-bold text-sm h-12 shadow-md hover:shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0891B2" }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                {/* Add to Cart — secondary CTA */}
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  disabled={!!product.outOfStock}
                  className="flex-1 rounded-xl font-bold text-sm h-12 border-2 transition-all hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: style.bg,
                    color: style.bg,
                    backgroundColor: style.lightBg,
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Shipping notice */}
              <div
                className="p-4 rounded-xl text-sm text-muted-foreground flex items-start gap-2.5"
                style={{ backgroundColor: style.lightBg }}
              >
                <Truck
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: style.bg }}
                />
                <span>
                  Free shipping on all orders · Cash on Delivery · Delivered in
                  2–5 business days
                </span>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      {/* ─── Reviews ─── */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display font-bold text-2xl text-foreground">
            Customer Reviews
          </h2>
          {reviews && reviews.length > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: style?.badge ?? "#F3F4F6",
                color: style?.badgeText ?? "#374151",
              }}
            >
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

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
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="p-5 bg-white rounded-2xl shadow-card"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
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
                <p className="text-muted-foreground text-sm leading-relaxed pl-[52px]">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-14 rounded-2xl"
            style={{ backgroundColor: style?.lightBg ?? "#F9FAFB" }}
          >
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
