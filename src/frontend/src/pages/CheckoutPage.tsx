import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { usePlaceOrderWithUser } from "@/hooks/useQueries";
import { formatPrice } from "@/utils/categoryColors";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SHIPPING_CENTS = BigInt(0);

type Step = "address" | "confirm";

interface AddressForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { currentUser, isInitializing } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const placeOrderWithUser = usePlaceOrderWithUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isInitializing && !currentUser) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [currentUser, isInitializing, navigate]);

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
  });

  const total = subtotal + (items.length > 0 ? SHIPPING_CENTS : BigInt(0));

  const addressValid =
    address.fullName.trim() &&
    address.phone.trim() &&
    address.street.trim() &&
    address.city.trim() &&
    address.zip.trim();

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressValid) return;
    setStep("confirm");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !currentUser) return;

    const addressString = `${address.fullName}, ${address.phone}, ${address.street}, ${address.city} ${address.zip}`;
    const productIds = items.map((item) => item.productId);
    const quantities = items.map((item) => BigInt(item.quantity));
    const totalCents = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    try {
      const orderId = await placeOrderWithUser.mutateAsync({
        username: currentUser.username,
        productIds,
        quantities,
        address: addressString,
        items: items.map((item) => ({
          productId: Number(item.productId),
          productName: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        totalCents,
      });

      clearCart();
      navigate({ to: "/order-confirmed", search: { orderId } });
    } catch (err) {
      console.error(err);
      toast.error("Order failed. Please try again.");
    }
  };

  const isOrderPending = placeOrderWithUser.isPending;

  if (items.length === 0 && !isOrderPending) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center min-h-screen">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-display font-bold text-2xl mb-4">
          Your cart is empty
        </h2>
        <Button
          onClick={() => navigate({ to: "/" })}
          className="text-white rounded-xl"
          style={{ backgroundColor: "#0891B2" }}
        >
          Browse Stores
        </Button>
      </main>
    );
  }

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    {
      key: "address",
      label: "Delivery Address",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      key: "confirm",
      label: "Confirm & Place Order",
      icon: <Package className="w-4 h-4" />,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
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
          <h1 className="font-display font-extrabold text-2xl text-white">
            Checkout
          </h1>
          {currentUser && (
            <span className="ml-auto text-sm text-white/50 hidden sm:block">
              Ordering as{" "}
              <span className="text-white/80 font-medium">
                {currentUser.displayName}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {steps.map((s, idx) => {
            const isActive = step === s.key;
            const isDone = s.key === "address" && step === "confirm";
            return (
              <div key={s.key} className="flex items-center gap-3">
                {idx > 0 && (
                  <div
                    className="h-0.5 w-12 sm:w-20 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: isDone ? "#16A34A" : "#E5E7EB",
                    }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: isDone
                        ? "#16A34A"
                        : isActive
                          ? "#06B6D4"
                          : "#F3F4F6",
                      color: isDone || isActive ? "white" : "#9CA3AF",
                    }}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className="text-sm font-semibold hidden sm:block transition-colors duration-300"
                    style={{
                      color: isActive
                        ? "#0891B2"
                        : isDone
                          ? "#16A34A"
                          : "#9CA3AF",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Forms */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "address" ? (
                <motion.form
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleAddressNext}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#ECFEFF" }}
                    >
                      <MapPin
                        className="w-5 h-5"
                        style={{ color: "#06B6D4" }}
                      />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl">
                        Delivery Address
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="fullName"
                        className="mb-1.5 block text-sm font-semibold"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Jane Smith"
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress((a) => ({
                            ...a,
                            fullName: e.target.value,
                          }))
                        }
                        required
                        autoComplete="name"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-semibold"
                      >
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="phone"
                          placeholder="+91 98765 43210"
                          value={address.phone}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              phone: e.target.value,
                            }))
                          }
                          required
                          autoComplete="tel"
                          className="rounded-xl h-11 pl-9"
                          type="tel"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="street"
                        className="mb-1.5 block text-sm font-semibold"
                      >
                        Street Address *
                      </Label>
                      <Input
                        id="street"
                        placeholder="123 Main Street, Apt 4B"
                        value={address.street}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, street: e.target.value }))
                        }
                        required
                        autoComplete="street-address"
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="city"
                          className="mb-1.5 block text-sm font-semibold"
                        >
                          City *
                        </Label>
                        <Input
                          id="city"
                          placeholder="Mumbai"
                          value={address.city}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, city: e.target.value }))
                          }
                          required
                          autoComplete="address-level2"
                          className="rounded-xl h-11"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="zip"
                          className="mb-1.5 block text-sm font-semibold"
                        >
                          PIN Code *
                        </Label>
                        <Input
                          id="zip"
                          placeholder="400001"
                          value={address.zip}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, zip: e.target.value }))
                          }
                          required
                          autoComplete="postal-code"
                          className="rounded-xl h-11"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!addressValid}
                    className="w-full mt-6 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#0891B2" }}
                  >
                    Continue to Confirm →
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handlePlaceOrder}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#ECFEFF" }}
                    >
                      <Truck className="w-5 h-5" style={{ color: "#06B6D4" }} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl">
                        Confirm & Place Order
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Review your order before placing
                      </p>
                    </div>
                  </div>

                  {/* Cash on Delivery card */}
                  <div
                    className="rounded-2xl p-5 mb-5"
                    style={{
                      background:
                        "linear-gradient(135deg, #ECFEFF 0%, #F0FDF4 100%)",
                      border: "2px solid rgba(6,182,212,0.25)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#DCFCE7" }}
                      >
                        <Package
                          className="w-5 h-5"
                          style={{ color: "#16A34A" }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-bold text-sm"
                          style={{ color: "#15803D" }}
                        >
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pay when your order arrives at your doorstep
                        </p>
                      </div>
                      <div
                        className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: "#DCFCE7",
                          color: "#15803D",
                        }}
                      >
                        ✓ Selected
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pl-[52px]">
                      No online payment required. Keep the exact amount ready
                      for a smooth delivery experience.
                    </p>
                  </div>

                  {/* Delivery address recap */}
                  <div
                    className="rounded-xl p-4 mb-5 text-sm"
                    style={{
                      backgroundColor: "#f8fdff",
                      border: "1px solid rgba(6,182,212,0.2)",
                    }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5"
                      style={{ color: "#0891B2" }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Delivering to
                    </p>
                    <p className="text-foreground font-semibold text-sm">
                      {address.fullName}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {address.phone}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {address.street}, {address.city} {address.zip}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="rounded-xl"
                      onClick={() => setStep("address")}
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isOrderPending}
                      className="flex-1 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all"
                      style={{ backgroundColor: "#0891B2" }}
                    >
                      {isOrderPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Place Order · {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h2 className="font-display font-bold text-base text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.productId.toString()}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground line-clamp-1 flex-1 pr-2">
                      {item.quantity}× {item.productName}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {formatPrice(item.price * BigInt(item.quantity))}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="text-green-600 font-semibold text-xs">
                    Cash on Delivery
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: "#0891B2" }}>{formatPrice(total)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <Truck className="w-3 h-3" />
                Pay on delivery · No prepayment needed
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
