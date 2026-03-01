import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddProduct,
  useAddStore,
  useDeleteProduct,
  useDeleteStore,
  useGetAllOrders,
  useGetAllStores,
  useGetProductsByStore,
  useToggleProductOutOfStock,
  useUpdateOrderStatus,
  useUpdateProduct,
  useUpdateStore,
} from "@/hooks/useQueries";
import type { StoreWithImage } from "@/hooks/useQueries";
import { formatPrice } from "@/utils/categoryColors";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Edit2,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Lock,
  Package,
  PackagePlus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Store,
  Trash2,
  TrendingUp,
  Users,
  Users2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";

const ADMIN_PASSWORD = "webfoo@admin2026";
const ADMIN_SESSION_KEY = "webfoo_admin_authed";

const STORE_CATEGORIES = [
  "General Store",
  "Flower Store",
  "Chocolate Store",
  "Grocery Store",
  "Vegetable Store",
  "Bakery",
  "Toy Store",
  "Bookstore",
  "Pharmacy",
  "Pet Store",
  "Electronics",
  "Clothing",
];

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

// Timestamps from localStorage are in milliseconds
function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  // Handle both ms and ns timestamps
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
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
      >
        {status}
      </span>
    );
  }
  if (normalized === "cancelled" || normalized === "failed") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
      >
        {status}
      </span>
    );
  }
  if (normalized === "shipped") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
      >
        {status}
      </span>
    );
  }
  if (normalized === "processing") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#EEF2FF", color: "#4F46E5" }}
      >
        {status}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: "rgba(6,182,212,0.15)", color: "#06B6D4" }}
    >
      {status}
    </span>
  );
}

function OrderRowSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

// Image upload component
function ImageUploader({
  value,
  onChange,
  label = "Product Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      await blob.getBytes();
      const url = blob.getDirectURL();
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload button */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 rounded-xl border-dashed"
          style={{ borderColor: "#06B6D4", color: "#0891B2" }}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
          )}
          {uploading ? `Uploading ${uploadProgress}%` : "Upload Image"}
        </Button>
        {!value && (
          <Input
            placeholder="Or paste image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 rounded-xl h-9 text-xs"
          />
        )}
      </div>
      {uploading && <Progress value={uploadProgress} className="h-1.5" />}
    </div>
  );
}

// ─── Orders Tab ────────────────────────────────────────────────────────────────

function OrdersTab() {
  const { data: orders, isLoading, refetch, isRefetching } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  // Orders are read from localStorage - no backend call
  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  const totalRevenue = sortedOrders.reduce(
    (sum, o) => sum + o.total,
    BigInt(0),
  );
  const uniqueCustomers = new Set(sortedOrders.map((o) => o.username)).size;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast.success(`Order status updated to "${newStatus}"`, {
        description: `Order ${orderId}`,
      });
      refetch();
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(6,182,212,0.12)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#ECFEFF" }}
            >
              <Package className="w-5 h-5" style={{ color: "#0891B2" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Total Orders
            </span>
          </div>
          <p className="text-3xl font-black" style={{ color: "#0891B2" }}>
            {isLoading ? "—" : sortedOrders.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(6,182,212,0.12)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Total Revenue
            </span>
          </div>
          <p className="text-3xl font-black" style={{ color: "#16A34A" }}>
            {isLoading ? "—" : formatPrice(totalRevenue)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(6,182,212,0.12)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#EEF2FF" }}
            >
              <Users className="w-5 h-5" style={{ color: "#4F46E5" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Unique Customers
            </span>
          </div>
          <p className="text-3xl font-black" style={{ color: "#4F46E5" }}>
            {isLoading ? "—" : uniqueCustomers}
          </p>
        </motion.div>
      </div>

      {/* Orders header */}
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-5 h-5" style={{ color: "#0891B2" }} />
        <h2 className="font-display font-bold text-lg text-foreground">
          All Orders
        </h2>
        {!isLoading && (
          <span className="text-sm text-muted-foreground ml-auto">
            {sortedOrders.length} order{sortedOrders.length !== 1 ? "s" : ""}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="border-border rounded-xl ml-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((id) => (
            <OrderRowSkeleton key={id} />
          ))}
        </div>
      ) : sortedOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#ECFEFF" }}
          >
            <Package className="w-10 h-10" style={{ color: "#06B6D4" }} />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            No orders yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Orders will appear here once customers start checking out.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(6,182,212,0.1)" }}
              >
                {/* Row header */}
                <div
                  className="px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fdff 0%, #ecfeff 100%)",
                    borderBottom: "1px solid rgba(6,182,212,0.1)",
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
                      <p className="font-bold text-sm font-mono text-foreground">
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(order.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(79,70,229,0.1)",
                        color: "#4F46E5",
                      }}
                    >
                      👤 {order.username}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Row body */}
                <div className="px-4 py-3">
                  <p className="text-sm text-foreground mb-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mr-2">
                      Items:
                    </span>
                    {order.items
                      .map(
                        (item) =>
                          `${Number(item.quantity)}× ${item.productName}`,
                      )
                      .join(", ")}
                  </p>

                  <Separator className="my-2" />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      <span className="text-xs font-semibold uppercase tracking-wide mr-2">
                        Deliver to:
                      </span>
                      {order.address}
                    </p>
                    <p
                      className="font-bold text-base"
                      style={{ color: "#0891B2" }}
                    >
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  {/* Status update */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Update Status:
                    </span>
                    <Select
                      value={order.status}
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger
                        className="h-8 text-xs rounded-lg w-36"
                        style={{ borderColor: "rgba(6,182,212,0.3)" }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updateOrderStatus.isPending && (
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        style={{ color: "#0891B2" }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Store Form ──────────────────────────────────────────────────────────────

interface StoreFormData {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
}

function StoreForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initial?: Partial<StoreFormData>;
  onSubmit: (data: StoreFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<StoreFormData>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? STORE_CATEGORIES[0],
    imageUrl: initial?.imageUrl ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-sm font-semibold mb-1.5 block">Store Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Fresh Bakery"
          className="rounded-xl h-10"
          required
        />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-1.5 block">
          Description
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Describe the store..."
          className="rounded-xl resize-none"
          rows={3}
          required
        />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-1.5 block">Category</Label>
        <Select
          value={form.category}
          onValueChange={(val) => setForm((f) => ({ ...f, category: val }))}
        >
          <SelectTrigger className="rounded-xl h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STORE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ImageUploader
        value={form.imageUrl}
        onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
        label="Store Image (optional)"
      />

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-xl text-white font-bold"
          style={{ backgroundColor: "#0891B2" }}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Save Store"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Manage Stores Tab ────────────────────────────────────────────────────────

function ManageStoresTab() {
  const { data: stores, isLoading } = useGetAllStores();
  const addStore = useAddStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<bigint | null>(null);

  const allStores = stores ?? [];

  const handleAddStore = async (data: StoreFormData) => {
    try {
      await addStore.mutateAsync(data);
      toast.success(`"${data.name}" added successfully`);
      setShowAddForm(false);
    } catch {
      toast.error("Failed to add store");
    }
  };

  const handleUpdateStore = async (id: bigint, data: StoreFormData) => {
    try {
      await updateStore.mutateAsync({ id, ...data });
      toast.success(`"${data.name}" updated successfully`);
      setEditingStoreId(null);
    } catch {
      toast.error("Failed to update store");
    }
  };

  const handleDeleteStore = async (id: bigint, name: string) => {
    if (
      !window.confirm(`Delete store "${name}"? This action cannot be undone.`)
    )
      return;
    try {
      await deleteStore.mutateAsync(id);
      toast.success(`"${name}" deleted successfully`);
      if (editingStoreId === id) setEditingStoreId(null);
    } catch {
      toast.error("Failed to delete store");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-5 h-5" style={{ color: "#0891B2" }} />
        <h2 className="font-display font-bold text-lg text-foreground">
          Manage Stores
        </h2>
        <Button
          size="sm"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingStoreId(null);
          }}
          className="ml-auto rounded-xl text-white font-bold text-xs"
          style={{ backgroundColor: "#0891B2" }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add New Store
        </Button>
      </div>

      {/* Add Store Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: "2px solid rgba(6,182,212,0.25)" }}
            >
              <h3 className="font-display font-bold text-base text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: "#0891B2" }} />
                Add New Store
              </h3>
              <StoreForm
                onSubmit={handleAddStore}
                onCancel={() => setShowAddForm(false)}
                isLoading={addStore.isPending}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stores list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-16 rounded-xl w-full" />
          ))}
        </div>
      ) : allStores.length === 0 ? (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#ECFEFF" }}
          >
            <Store className="w-8 h-8" style={{ color: "#06B6D4" }} />
          </div>
          <p className="font-semibold text-foreground mb-1">No stores yet</p>
          <p className="text-sm text-muted-foreground">
            Click "Add New Store" to create your first store.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allStores.map((store) => (
            <motion.div
              key={store.id.toString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(6,182,212,0.12)" }}
            >
              {/* Store row */}
              <div className="px-4 py-3 flex items-center gap-3">
                {(store as StoreWithImage).imageUrl ? (
                  <img
                    src={(store as StoreWithImage).imageUrl}
                    alt={store.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(6,182,212,0.1)" }}
                  >
                    <Store className="w-5 h-5" style={{ color: "#0891B2" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {store.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {store.category}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingStoreId(
                      editingStoreId === store.id ? null : store.id,
                    )
                  }
                  className="rounded-xl text-xs flex-shrink-0"
                  style={{
                    borderColor: "rgba(6,182,212,0.3)",
                    color: "#0891B2",
                  }}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  {editingStoreId === store.id ? "Close" : "Edit"}
                  {editingStoreId === store.id ? (
                    <ChevronUp className="w-3 h-3 ml-1" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-1" />
                  )}
                </Button>
                {/* Delete button — only for admin-added local stores (id >= 100) */}
                {Number(store.id) >= 100 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStore(store.id, store.name)}
                    disabled={deleteStore.isPending}
                    className="rounded-xl text-xs flex-shrink-0"
                    style={{
                      borderColor: "#FECACA",
                      color: "#B91C1C",
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Inline edit form */}
              <AnimatePresence>
                {editingStoreId === store.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 pt-4"
                      style={{
                        borderTop: "1px solid rgba(6,182,212,0.12)",
                        backgroundColor: "#f8fdff",
                      }}
                    >
                      <StoreForm
                        initial={{
                          name: store.name,
                          description: store.description,
                          category: store.category,
                          imageUrl: (store as StoreWithImage).imageUrl ?? "",
                        }}
                        onSubmit={(data) => handleUpdateStore(store.id, data)}
                        onCancel={() => setEditingStoreId(null)}
                        isLoading={updateStore.isPending}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initial?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    imageUrl: initial?.imageUrl ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number.parseFloat(form.price);
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      Number.isNaN(priceNum) ||
      priceNum <= 0
    ) {
      toast.error("Please fill in all required fields with valid values");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-sm font-semibold mb-1.5 block">
          Product Name
        </Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Organic Sourdough Bread"
          className="rounded-xl h-10"
          required
        />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-1.5 block">
          Description
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Describe the product..."
          className="rounded-xl resize-none"
          rows={3}
          required
        />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-1.5 block">
          Price (in ₹)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
            ₹
          </span>
          <Input
            type="number"
            step="1"
            min="1"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="299"
            className="rounded-xl h-10 pl-7"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter price in Indian Rupees (e.g. 299)
        </p>
      </div>

      <ImageUploader
        value={form.imageUrl}
        onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
        label="Product Image (optional)"
      />

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-xl text-white font-bold"
          style={{ backgroundColor: "#0891B2" }}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Save Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Products List for a Store ─────────────────────────────────────────────────

function StoreProductsList({ storeId }: { storeId: bigint }) {
  const { data: products, isLoading } = useGetProductsByStore(storeId);
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const toggleOutOfStock = useToggleProductOutOfStock();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<bigint | null>(null);

  const handleAddProduct = async (data: ProductFormData) => {
    // Price is directly in INR rupees (no *100)
    const priceVal = BigInt(Math.round(Number.parseFloat(data.price)));
    try {
      await addProduct.mutateAsync({
        storeId,
        name: data.name,
        description: data.description,
        price: priceVal,
        imageUrl: data.imageUrl,
      });
      toast.success(`"${data.name}" added to store`);
      setShowAddForm(false);
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleUpdateProduct = async (
    productId: bigint,
    data: ProductFormData,
  ) => {
    // Price is directly in INR rupees (no *100)
    const priceVal = BigInt(Math.round(Number.parseFloat(data.price)));
    try {
      await updateProduct.mutateAsync({
        id: productId,
        storeId,
        name: data.name,
        description: data.description,
        price: priceVal,
        imageUrl: data.imageUrl,
      });
      toast.success(`"${data.name}" updated`);
      setEditingProductId(null);
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id: bigint, name: string) => {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`))
      return;
    try {
      await deleteProduct.mutateAsync({ id, storeId });
      toast.success(`"${name}" deleted`);
      if (editingProductId === id) setEditingProductId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleOutOfStock = async (
    id: bigint,
    name: string,
    currentOutOfStock: boolean,
  ) => {
    try {
      await toggleOutOfStock.mutateAsync({ id, storeId });
      toast.success(
        currentOutOfStock
          ? `"${name}" marked as In Stock`
          : `"${name}" marked as Out of Stock`,
      );
    } catch {
      toast.error("Failed to update stock status");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 mb-4">
        <PackagePlus className="w-4 h-4" style={{ color: "#0891B2" }} />
        <h3 className="font-semibold text-sm text-foreground">
          Products in this store
        </h3>
        <Button
          size="sm"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProductId(null);
          }}
          className="ml-auto rounded-xl text-white text-xs"
          style={{ backgroundColor: "#0891B2" }}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: "2px solid rgba(6,182,212,0.25)" }}
            >
              <h4 className="font-display font-bold text-sm text-foreground mb-4">
                Add New Product
              </h4>
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddForm(false)}
                isLoading={addProduct.isPending}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div
          className="text-center py-10 rounded-xl"
          style={{ backgroundColor: "#f8fdff" }}
        >
          <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No products yet. Add your first product above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id.toString()}
              className="bg-white rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(6,182,212,0.1)" }}
            >
              <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#ECFEFF" }}
                  >
                    <Package className="w-4 h-4" style={{ color: "#0891B2" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {product.name}
                    </p>
                    {(product as any).outOfStock && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                      >
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(product.price)}
                  </p>
                </div>
                {/* Out of Stock toggle — only for local products (id >= 10000) */}
                {Number(product.id) >= 10000 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleToggleOutOfStock(
                        product.id,
                        product.name,
                        !!(product as any).outOfStock,
                      )
                    }
                    disabled={toggleOutOfStock.isPending}
                    className="rounded-lg text-xs flex-shrink-0"
                    style={{
                      borderColor: (product as any).outOfStock
                        ? "rgba(22,163,74,0.3)"
                        : "rgba(234,88,12,0.3)",
                      color: (product as any).outOfStock
                        ? "#16A34A"
                        : "#EA580C",
                    }}
                  >
                    {(product as any).outOfStock
                      ? "Mark In Stock"
                      : "Mark Out of Stock"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingProductId(
                      editingProductId === product.id ? null : product.id,
                    )
                  }
                  className="rounded-lg text-xs flex-shrink-0"
                  style={{
                    borderColor: "rgba(6,182,212,0.3)",
                    color: "#0891B2",
                  }}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  {editingProductId === product.id ? "Close" : "Edit"}
                </Button>
                {/* Delete button — only for local products (id >= 10000) */}
                {Number(product.id) >= 10000 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDeleteProduct(product.id, product.name)
                    }
                    disabled={deleteProduct.isPending}
                    className="rounded-lg text-xs flex-shrink-0"
                    style={{
                      borderColor: "#FECACA",
                      color: "#B91C1C",
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Inline edit form */}
              <AnimatePresence>
                {editingProductId === product.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 pt-4"
                      style={{
                        borderTop: "1px solid rgba(6,182,212,0.12)",
                        backgroundColor: "#f8fdff",
                      }}
                    >
                      <ProductForm
                        initial={{
                          name: product.name,
                          description: product.description,
                          price: Number(product.price).toString(),
                          imageUrl: product.imageUrl ?? "",
                        }}
                        onSubmit={(data) =>
                          handleUpdateProduct(product.id, data)
                        }
                        onCancel={() => setEditingProductId(null)}
                        isLoading={updateProduct.isPending}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Manage Products Tab ──────────────────────────────────────────────────────

function ManageProductsTab() {
  const { data: stores, isLoading: storesLoading } = useGetAllStores();
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  const allStores = stores ?? [];

  const selectedStore = allStores.find(
    (s) => s.id.toString() === selectedStoreId,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <PackagePlus className="w-5 h-5" style={{ color: "#0891B2" }} />
        <h2 className="font-display font-bold text-lg text-foreground">
          Manage Products
        </h2>
      </div>

      {/* Store selector */}
      <div className="mb-6">
        <Label className="text-sm font-semibold mb-2 block">
          Select a Store to manage products
        </Label>
        {storesLoading ? (
          <Skeleton className="h-10 rounded-xl w-full max-w-sm" />
        ) : (
          <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
            <SelectTrigger
              className="rounded-xl h-10 max-w-sm"
              style={{ borderColor: "rgba(6,182,212,0.3)" }}
            >
              <SelectValue placeholder="Choose a store..." />
            </SelectTrigger>
            <SelectContent>
              {allStores.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  No stores available — add one first
                </SelectItem>
              ) : (
                allStores.map((store) => (
                  <SelectItem
                    key={store.id.toString()}
                    value={store.id.toString()}
                  >
                    {store.name} ({store.category})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Products for selected store */}
      {selectedStore ? (
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid rgba(6,182,212,0.15)" }}
        >
          <div className="flex items-center gap-3 mb-1">
            {selectedStore.imageUrl ? (
              <img
                src={selectedStore.imageUrl}
                alt={selectedStore.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#ECFEFF" }}
              >
                <Store className="w-5 h-5" style={{ color: "#0891B2" }} />
              </div>
            )}
            <div>
              <h3 className="font-display font-bold text-base text-foreground">
                {selectedStore.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedStore.category}
              </p>
            </div>
          </div>
          <Separator className="my-3" />
          <StoreProductsList storeId={selectedStore.id} />
        </div>
      ) : !storesLoading && allStores.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            border: "2px dashed rgba(6,182,212,0.25)",
            backgroundColor: "#f8fdff",
          }}
        >
          <Store className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">No stores yet</p>
          <p className="text-sm text-muted-foreground">
            Go to the "Manage Stores" tab to add your first store, then you can
            add products here.
          </p>
        </div>
      ) : (
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            border: "2px dashed rgba(6,182,212,0.2)",
            backgroundColor: "#f8fdff",
          }}
        >
          <PackagePlus
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "#06B6D4", opacity: 0.5 }}
          />
          <p className="text-muted-foreground text-sm">
            Select a store above to view and manage its products.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Customers Tab ────────────────────────────────────────────────────────────

interface KnownUser {
  username: string;
  displayName: string;
  passwordHash: string;
}

function CustomersTab() {
  const [revealedPasswords, setRevealedPasswords] = useState<
    Record<string, boolean>
  >({});

  const customers: KnownUser[] = (() => {
    try {
      const raw = localStorage.getItem("webfoo_known_users");
      return raw ? (JSON.parse(raw) as KnownUser[]) : [];
    } catch {
      return [];
    }
  })();

  const toggleReveal = (username: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  return (
    <div>
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(6,182,212,0.12)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#EEF2FF" }}
            >
              <Users2 className="w-5 h-5" style={{ color: "#4F46E5" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Total Registered Customers
            </span>
          </div>
          <p className="text-3xl font-black" style={{ color: "#4F46E5" }}>
            {customers.length}
          </p>
        </motion.div>
      </div>

      {/* Customers header */}
      <div className="flex items-center gap-3 mb-4">
        <Users2 className="w-5 h-5" style={{ color: "#4F46E5" }} />
        <h2 className="font-display font-bold text-lg text-foreground">
          All Customers
        </h2>
        <span className="text-sm text-muted-foreground ml-auto">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {customers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#EEF2FF" }}
          >
            <Users2 className="w-10 h-10" style={{ color: "#4F46E5" }} />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            No customers yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Customers will appear here once they register on your site.
          </p>
        </motion.div>
      ) : (
        <div
          className="bg-white rounded-2xl overflow-hidden shadow-sm"
          style={{ border: "1px solid rgba(6,182,212,0.12)" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground"
            style={{
              backgroundColor: "#f8fdff",
              borderBottom: "1px solid rgba(6,182,212,0.1)",
            }}
          >
            <div className="col-span-1">#</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Login ID</div>
            <div className="col-span-4">Password</div>
          </div>

          {/* Customer rows */}
          <div className="divide-y divide-border/50">
            <AnimatePresence>
              {customers.map((customer, idx) => (
                <motion.div
                  key={customer.username}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="grid grid-cols-12 px-4 py-3.5 items-center text-sm hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-1 text-xs text-muted-foreground font-mono">
                    {idx + 1}
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#4F46E5" }}
                      >
                        {customer.displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground text-xs truncate">
                        {customer.displayName}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: "#EEF2FF", color: "#4338CA" }}
                    >
                      {customer.username}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-foreground">
                        {revealedPasswords[customer.username]
                          ? customer.passwordHash
                          : "••••••••"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(customer.username)}
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        title={
                          revealedPasswords[customer.username]
                            ? "Hide password"
                            : "Show password hash"
                        }
                      >
                        {revealedPasswords[customer.username] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
        <Lock className="w-3 h-3" />
        Passwords shown are hashed values stored in the browser's localStorage.
      </p>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <div>
      {/* Dashboard header */}
      <div
        className="border-b border-white/10"
        style={{
          background: "linear-gradient(135deg, #0a1520 0%, #0c2233 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(6,182,212,0.2)" }}
          >
            <ShieldCheck className="w-5 h-5" style={{ color: "#06B6D4" }} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs text-white/50">
              WebFoo Mart management console
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="orders">
          <TabsList
            className="mb-8 rounded-xl p-1 gap-1 flex-wrap h-auto"
            style={{
              backgroundColor: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.15)",
            }}
          >
            <TabsTrigger
              value="orders"
              className="rounded-lg text-sm font-semibold flex items-center gap-2 px-4 data-[state=active]:bg-white data-[state=active]:text-[#0891B2] data-[state=active]:shadow-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="stores"
              className="rounded-lg text-sm font-semibold flex items-center gap-2 px-4 data-[state=active]:bg-white data-[state=active]:text-[#0891B2] data-[state=active]:shadow-sm"
            >
              <Store className="w-4 h-4" />
              Manage Stores
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-lg text-sm font-semibold flex items-center gap-2 px-4 data-[state=active]:bg-white data-[state=active]:text-[#0891B2] data-[state=active]:shadow-sm"
            >
              <PackagePlus className="w-4 h-4" />
              Manage Products
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="rounded-lg text-sm font-semibold flex items-center gap-2 px-4 data-[state=active]:bg-white data-[state=active]:text-[#4F46E5] data-[state=active]:shadow-sm"
            >
              <Users2 className="w-4 h-4" />
              Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="stores">
            <ManageStoresTab />
          </TabsContent>
          <TabsContent value="products">
            <ManageProductsTab />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Admin Page (login gate) ──────────────────────────────────────────────────

export function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check session storage for existing auth
  const [isAuthed, setIsAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      } catch {
        // ignore sessionStorage errors
      }
      setIsAuthed(true);
      setError("");
    } else {
      setError("Incorrect admin password. Please try again.");
      setPassword("");
    }
  };

  if (isAuthed) {
    return <AdminDashboard />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="bg-white rounded-2xl shadow-lg p-8"
          style={{ border: "1px solid rgba(6,182,212,0.15)" }}
        >
          {/* Icon + title */}
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#ECFEFF" }}
            >
              <ShieldCheck className="w-7 h-7" style={{ color: "#0891B2" }} />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">
              Admin Access
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your admin password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="adminPassword"
                className="mb-1.5 block text-sm font-semibold"
              >
                Admin Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="pl-9 pr-10 rounded-xl h-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-red-600 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              size="lg"
              disabled={!password.trim()}
              className="w-full text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all"
              style={{ backgroundColor: "#0891B2" }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Access Dashboard
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          WebFoo Mart Admin · Authorized personnel only
        </p>
      </motion.div>
    </main>
  );
}
