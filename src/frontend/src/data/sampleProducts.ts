import type { Product } from "@/backend.d";

// Sample products for frontend-only stores (storeIds 7-12)
// Prices are in cents (e.g., 2499 = $24.99)

export const SAMPLE_PRODUCTS: Record<string, Product[]> = {
  "7": [
    {
      id: BigInt(701),
      storeId: BigInt(7),
      name: "Classic LEGO City Set",
      description:
        "Build an entire city block with 520 pieces including cars, buildings, and mini-figures.",
      price: BigInt(4999),
    },
    {
      id: BigInt(702),
      storeId: BigInt(7),
      name: "Stuffed Panda Bear",
      description:
        "Super soft and huggable giant panda plush toy, perfect for all ages.",
      price: BigInt(2499),
    },
    {
      id: BigInt(703),
      storeId: BigInt(7),
      name: "Remote Control Racing Car",
      description:
        "High-speed RC car with 2.4GHz control, LED headlights, and 30mph top speed.",
      price: BigInt(5999),
    },
    {
      id: BigInt(704),
      storeId: BigInt(7),
      name: "Magnetic Tiles Set (100pc)",
      description:
        "Educational magnetic building tiles in vibrant colors. Endless creative possibilities!",
      price: BigInt(3499),
    },
    {
      id: BigInt(705),
      storeId: BigInt(7),
      name: "Board Game: Family Trivia",
      description:
        "500 fun trivia questions for family game nights. Ages 6 and up.",
      price: BigInt(1999),
    },
    {
      id: BigInt(706),
      storeId: BigInt(7),
      name: "Watercolor Art Kit",
      description:
        "Professional-grade watercolors with 24 colors, 3 brushes, and a mixing palette.",
      price: BigInt(1499),
    },
  ],
  "8": [
    {
      id: BigInt(801),
      storeId: BigInt(8),
      name: "The Midnight Library",
      description:
        "A dazzling novel about all the choices that go into a life well lived. By Matt Haig.",
      price: BigInt(1699),
    },
    {
      id: BigInt(802),
      storeId: BigInt(8),
      name: "Atomic Habits",
      description:
        "An Easy & Proven Way to Build Good Habits & Break Bad Ones. By James Clear.",
      price: BigInt(1599),
    },
    {
      id: BigInt(803),
      storeId: BigInt(8),
      name: "Dune (Complete Collection)",
      description:
        "All 6 books in Frank Herbert's legendary science fiction epic. Hardcover box set.",
      price: BigInt(7999),
    },
    {
      id: BigInt(804),
      storeId: BigInt(8),
      name: "Illustrated Cookbook: World Flavors",
      description:
        "300 authentic recipes from 60 countries with stunning photography.",
      price: BigInt(3499),
    },
    {
      id: BigInt(805),
      storeId: BigInt(8),
      name: "The Design of Everyday Things",
      description:
        "Don Norman's timeless guide to human-centered design. Revised & expanded edition.",
      price: BigInt(2199),
    },
    {
      id: BigInt(806),
      storeId: BigInt(8),
      name: "Children's Encyclopedia Set",
      description:
        "5-volume illustrated encyclopedia covering science, nature, history, art, and space.",
      price: BigInt(4999),
    },
  ],
  "9": [
    {
      id: BigInt(901),
      storeId: BigInt(9),
      name: "Vitamin D3 + K2 (90 caps)",
      description:
        "High-potency vitamin D3 5000 IU with K2 for optimal calcium absorption.",
      price: BigInt(2299),
    },
    {
      id: BigInt(902),
      storeId: BigInt(9),
      name: "First Aid Kit (85-piece)",
      description:
        "Comprehensive first aid kit in a water-resistant case. Essential for home and travel.",
      price: BigInt(2999),
    },
    {
      id: BigInt(903),
      storeId: BigInt(9),
      name: "Digital Blood Pressure Monitor",
      description:
        "Clinically validated upper arm BP monitor with irregular heartbeat detection.",
      price: BigInt(4499),
    },
    {
      id: BigInt(904),
      storeId: BigInt(9),
      name: "Omega-3 Fish Oil (120 softgels)",
      description:
        "Triple-strength fish oil with EPA and DHA for heart and brain health.",
      price: BigInt(1999),
    },
    {
      id: BigInt(905),
      storeId: BigInt(9),
      name: "Melatonin Sleep Gummies",
      description:
        "Natural cherry-flavored sleep gummies. 5mg melatonin per serving, 60 count.",
      price: BigInt(1499),
    },
    {
      id: BigInt(906),
      storeId: BigInt(9),
      name: "Medical Grade Face Masks (50pk)",
      description:
        "ASTM Level 3 disposable face masks. Individually sealed for maximum hygiene.",
      price: BigInt(1299),
    },
  ],
  "10": [
    {
      id: BigInt(1001),
      storeId: BigInt(10),
      name: "Premium Dry Dog Food (15kg)",
      description:
        "Grain-free recipe with real chicken and sweet potato. All life stages.",
      price: BigInt(5999),
    },
    {
      id: BigInt(1002),
      storeId: BigInt(10),
      name: "Cat Scratch Tower",
      description:
        "6-level cat tree with sisal posts, cozy hammock, and dangling toys.",
      price: BigInt(7999),
    },
    {
      id: BigInt(1003),
      storeId: BigInt(10),
      name: "Automatic Pet Water Fountain",
      description:
        "2.5L stainless steel water fountain with triple filtration for cats and dogs.",
      price: BigInt(3499),
    },
    {
      id: BigInt(1004),
      storeId: BigInt(10),
      name: "Squeaky Plush Dog Toys (6pk)",
      description:
        "Durable plush toys in fun animal shapes. Safe, non-toxic, machine washable.",
      price: BigInt(1999),
    },
    {
      id: BigInt(1005),
      storeId: BigInt(10),
      name: "Pet GPS Tracker",
      description:
        "Lightweight collar attachment with real-time GPS tracking and activity monitoring.",
      price: BigInt(4999),
    },
    {
      id: BigInt(1006),
      storeId: BigInt(10),
      name: "Grooming Kit (12-piece)",
      description:
        "Complete pet grooming set: nail clippers, slicker brush, comb, scissors, and more.",
      price: BigInt(2999),
    },
  ],
  "11": [
    {
      id: BigInt(1101),
      storeId: BigInt(11),
      name: "Wireless Noise-Cancelling Headphones",
      description:
        "40hr battery life, premium ANC, and crystal-clear Hi-Res audio. Foldable design.",
      price: BigInt(14999),
    },
    {
      id: BigInt(1102),
      storeId: BigInt(11),
      name: "Smart LED Desk Lamp",
      description:
        "USB-C charging, 5 color temperatures, dimmable, with memory function and timer.",
      price: BigInt(4999),
    },
    {
      id: BigInt(1103),
      storeId: BigInt(11),
      name: "Portable SSD 1TB",
      description:
        "USB 3.2 Gen 2 speeds up to 1050MB/s. Shock resistant, tiny form factor.",
      price: BigInt(8999),
    },
    {
      id: BigInt(1104),
      storeId: BigInt(11),
      name: "Mechanical Keyboard (TKL)",
      description:
        "Tenkeyless gaming keyboard with RGB backlight and tactile brown switches.",
      price: BigInt(6999),
    },
    {
      id: BigInt(1105),
      storeId: BigInt(11),
      name: "Smart Home Hub",
      description:
        "Control all your smart devices from one place. Compatible with Alexa and Google.",
      price: BigInt(5999),
    },
    {
      id: BigInt(1106),
      storeId: BigInt(11),
      name: "4K Webcam with Mic",
      description:
        "Ultra HD webcam with autofocus, noise-cancelling mic, and privacy shutter.",
      price: BigInt(9999),
    },
  ],
  "12": [
    {
      id: BigInt(1201),
      storeId: BigInt(12),
      name: "Linen Blend Blazer",
      description:
        "Relaxed-fit blazer in natural linen blend. Perfect for smart-casual occasions.",
      price: BigInt(8999),
    },
    {
      id: BigInt(1202),
      storeId: BigInt(12),
      name: "Graphic Tee Bundle (3-pack)",
      description:
        "Three premium cotton tees with unique hand-drawn graphic prints.",
      price: BigInt(4499),
    },
    {
      id: BigInt(1203),
      storeId: BigInt(12),
      name: "High-Waist Jogger Pants",
      description:
        "Ultra-soft modal fabric with tapered fit. Available in 6 neutral colorways.",
      price: BigInt(5999),
    },
    {
      id: BigInt(1204),
      storeId: BigInt(12),
      name: "Knit Cardigan (Oversized)",
      description:
        "Chunky ribbed knit cardigan in merino wool blend. Cozy and stylish.",
      price: BigInt(7999),
    },
    {
      id: BigInt(1205),
      storeId: BigInt(12),
      name: "Minimalist Canvas Sneakers",
      description:
        "Classic vulcanized canvas sneakers with cushioned insole. Timeless style.",
      price: BigInt(6499),
    },
    {
      id: BigInt(1206),
      storeId: BigInt(12),
      name: "Woven Tote Bag",
      description:
        "Hand-woven cotton tote with leather handles and interior zipper pocket.",
      price: BigInt(3999),
    },
  ],
};
