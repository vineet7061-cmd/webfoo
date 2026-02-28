export interface CategoryStyle {
  bg: string;
  text: string;
  badge: string;
  badgeText: string;
  emoji: string;
  border: string;
  lightBg: string;
}

const categoryMap: Record<string, CategoryStyle> = {
  "General Store": {
    bg: "#3B82F6",
    text: "#ffffff",
    badge: "#DBEAFE",
    badgeText: "#1D4ED8",
    emoji: "🏪",
    border: "#3B82F6",
    lightBg: "#EFF6FF",
  },
  "Flower Store": {
    bg: "#EC4899",
    text: "#ffffff",
    badge: "#FCE7F3",
    badgeText: "#BE185D",
    emoji: "🌸",
    border: "#EC4899",
    lightBg: "#FDF2F8",
  },
  "Chocolate Store": {
    bg: "#92400E",
    text: "#ffffff",
    badge: "#FEF3C7",
    badgeText: "#92400E",
    emoji: "🍫",
    border: "#92400E",
    lightBg: "#FFFBEB",
  },
  "Grocery Store": {
    bg: "#16A34A",
    text: "#ffffff",
    badge: "#DCFCE7",
    badgeText: "#15803D",
    emoji: "🛒",
    border: "#16A34A",
    lightBg: "#F0FDF4",
  },
  "Vegetable Store": {
    bg: "#65A30D",
    text: "#ffffff",
    badge: "#ECFCCB",
    badgeText: "#4D7C0F",
    emoji: "🥦",
    border: "#65A30D",
    lightBg: "#F7FEE7",
  },
  Bakery: {
    bg: "#EA580C",
    text: "#ffffff",
    badge: "#FFEDD5",
    badgeText: "#C2410C",
    emoji: "🥐",
    border: "#EA580C",
    lightBg: "#FFF7ED",
  },
  "Toy Store": {
    bg: "#DC2626",
    text: "#ffffff",
    badge: "#FEE2E2",
    badgeText: "#B91C1C",
    emoji: "🧸",
    border: "#DC2626",
    lightBg: "#FEF2F2",
  },
  Bookstore: {
    bg: "#0D9488",
    text: "#ffffff",
    badge: "#CCFBF1",
    badgeText: "#0F766E",
    emoji: "📚",
    border: "#0D9488",
    lightBg: "#F0FDFA",
  },
  Pharmacy: {
    bg: "#0891B2",
    text: "#ffffff",
    badge: "#CFFAFE",
    badgeText: "#0E7490",
    emoji: "💊",
    border: "#0891B2",
    lightBg: "#ECFEFF",
  },
  "Pet Store": {
    bg: "#CA8A04",
    text: "#ffffff",
    badge: "#FEF9C3",
    badgeText: "#A16207",
    emoji: "🐾",
    border: "#CA8A04",
    lightBg: "#FEFCE8",
  },
  Electronics: {
    bg: "#4F46E5",
    text: "#ffffff",
    badge: "#EEF2FF",
    badgeText: "#4338CA",
    emoji: "⚡",
    border: "#4F46E5",
    lightBg: "#EEF2FF",
  },
  Clothing: {
    bg: "#9333EA",
    text: "#ffffff",
    badge: "#F3E8FF",
    badgeText: "#7E22CE",
    emoji: "👗",
    border: "#9333EA",
    lightBg: "#FAF5FF",
  },
};

const defaultStyle: CategoryStyle = {
  bg: "#6B7280",
  text: "#ffffff",
  badge: "#F3F4F6",
  badgeText: "#374151",
  emoji: "🏬",
  border: "#6B7280",
  lightBg: "#F9FAFB",
};

export function getCategoryStyle(category: string): CategoryStyle {
  return categoryMap[category] ?? defaultStyle;
}

export function formatPrice(priceCents: bigint): string {
  const cents = Number(priceCents);
  return `$${(cents / 100).toFixed(2)}`;
}
