import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { usePlaceOrder } from "@/hooks/useQueries";
import { formatPrice } from "@/utils/categoryColors";
import { useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Loader2, MapPin, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SHIPPING_CENTS = BigInt(499);

type Step = "address" | "payment";

interface AddressForm {
  fullName: string;
  street: string;
  city: string;
  zip: string;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

function formatCardNumber(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    street: "",
    city: "",
    zip: "",
  });
  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const total = subtotal + (items.length > 0 ? SHIPPING_CENTS : BigInt(0));

  const addressValid =
    address.fullName.trim() &&
    address.street.trim() &&
    address.city.trim() &&
    address.zip.trim();

  const paymentValid =
    payment.cardNumber.replace(/\s/g, "").length === 16 &&
    payment.expiry.length === 5 &&
    payment.cvv.length >= 3;

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressValid) return;
    setStep("payment");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentValid || items.length === 0) return;

    const addressString = `${address.fullName}, ${address.street}, ${address.city} ${address.zip}`;
    const productIds = items.map((item) => item.productId);
    const quantities = items.map((item) => BigInt(item.quantity));

    try {
      const orderId = await placeOrder.mutateAsync({
        productIds,
        quantities,
        address: addressString,
      });
      clearCart();
      navigate({ to: "/order-confirmed", search: { orderId } });
    } catch (err) {
      console.error(err);
      toast.error("Order failed. Please try again.");
    }
  };

  if (items.length === 0 && !placeOrder.isPending) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center min-h-screen">
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
      key: "payment",
      label: "Payment",
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div
        className="border-b border-border"
        style={{
          background: "linear-gradient(135deg, #0c1a24 0%, #0d2030 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(6,182,212,0.2)" }}
          >
            <ShoppingBag className="w-5 h-5" style={{ color: "#06B6D4" }} />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, idx) => {
            const isActive = step === s.key;
            const isDone = s.key === "address" && step === "payment";
            return (
              <div key={s.key} className="flex items-center gap-2">
                {idx > 0 && (
                  <div
                    className="h-px w-8 sm:w-16 transition-colors duration-300"
                    style={{
                      backgroundColor: isDone ? "#16A34A" : "#E5E7EB",
                    }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
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
                    className="text-sm font-medium hidden sm:block transition-colors duration-300"
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

        <div className="grid lg:grid-cols-3 gap-8">
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
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "#ECFEFF" }}
                    >
                      <MapPin
                        className="w-5 h-5"
                        style={{ color: "#06B6D4" }}
                      />
                    </div>
                    <h2 className="font-display font-bold text-xl">
                      Delivery Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="fullName"
                        className="mb-1.5 block text-sm font-medium"
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
                        htmlFor="street"
                        className="mb-1.5 block text-sm font-medium"
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
                          className="mb-1.5 block text-sm font-medium"
                        >
                          City *
                        </Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
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
                          className="mb-1.5 block text-sm font-medium"
                        >
                          ZIP Code *
                        </Label>
                        <Input
                          id="zip"
                          placeholder="94102"
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
                    className="w-full mt-6 text-white rounded-xl font-bold"
                    style={{ backgroundColor: "#0891B2" }}
                  >
                    Continue to Payment →
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handlePlaceOrder}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "#ECFEFF" }}
                    >
                      <CreditCard
                        className="w-5 h-5"
                        style={{ color: "#06B6D4" }}
                      />
                    </div>
                    <h2 className="font-display font-bold text-xl">
                      Payment Details
                    </h2>
                    <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                      🔒 Simulated
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="cardNumber"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Card Number *
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={payment.cardNumber}
                        onChange={(e) =>
                          setPayment((p) => ({
                            ...p,
                            cardNumber: formatCardNumber(e.target.value),
                          }))
                        }
                        required
                        className="rounded-xl h-11 font-mono tracking-wider"
                        maxLength={19}
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="expiry"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          Expiry Date *
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={payment.expiry}
                          onChange={(e) =>
                            setPayment((p) => ({
                              ...p,
                              expiry: formatExpiry(e.target.value),
                            }))
                          }
                          required
                          className="rounded-xl h-11 font-mono"
                          maxLength={5}
                          autoComplete="cc-exp"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="cvv"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          CVV *
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={payment.cvv}
                          onChange={(e) =>
                            setPayment((p) => ({
                              ...p,
                              cvv: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            }))
                          }
                          required
                          className="rounded-xl h-11 font-mono"
                          type="password"
                          maxLength={4}
                          autoComplete="cc-csc"
                        />
                      </div>
                    </div>
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
                      disabled={!paymentValid || placeOrder.isPending}
                      className="flex-1 text-white rounded-xl font-bold"
                      style={{ backgroundColor: "#0891B2" }}
                    >
                      {placeOrder.isPending ? (
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
                  <span>{formatPrice(SHIPPING_CENTS)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: "#0891B2" }}>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
