# WebFoo E-Commerce Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full guest-only e-commerce platform called "WebFoo"
- Homepage with header (logo + cart icon), centered search bar, and 2-column store directory grid (10-12 stores)
- Store categories: General Store, Flower Store, Chocolate Store, Grocery Store, Vegetable Store, Bakery Store, Electronics Store, Clothing Store, Pet Store, Toy Store, Bookstore, Pharmacy Store
- Individual store page showing that store's product grid
- Product detail page with image, description, price, quantity selector, customer reviews, "Buy Now" and "Add to Cart" buttons
- Cart page: view selected items, quantities, total, and proceed to checkout
- Checkout flow: delivery address form then simulated payment gateway screen
- "Buy Now" skips cart and goes directly to checkout
- All product/store data is seeded sample content (no admin panel)
- Payment is fully simulated (no real transaction)
- Guest-only: no login or user accounts

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: stores, products (with price, description, image URL, reviews), cart state (in-memory per session via canister), order submission (simulated)
2. Seed 10-12 stores each with 6-10 sample products
3. Frontend pages:
   - `/` - Homepage: header, search bar, store grid
   - `/store/:id` - Store page: store header, product grid
   - `/product/:id` - Product detail: image, description, price, quantity, reviews, Buy Now / Add to Cart
   - `/cart` - Cart page: items, totals, proceed to checkout
   - `/checkout` - Checkout: address form + simulated payment screen
   - `/order-confirmed` - Order confirmation screen
4. Cart state managed on frontend (React state / localStorage) since guest-only
5. Search filters store directory on homepage in real time
