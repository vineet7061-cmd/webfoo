# WebFoo Mart

## Current State
A full-stack e-commerce marketplace on the Internet Computer. The existing app has:
- Header with circular logo (WebFoo Mart brand), cart icon, dark background (#0f0f0f)
- Homepage with hero section, centered search bar, 2-column store grid (12 stores total: 6 from backend, 6 frontend-only)
- Store page with product grid per store
- Product detail page with quantity selector, Buy Now / Add to Cart buttons, reviews section
- Cart page with item management and order summary
- Checkout page with address + payment (simulated) 2-step flow
- Order confirmed page
- Guest-only (no authentication)
- Cyan/black theme (#06B6D4, #0891B2) matching the uploaded logo
- Category-specific color styles and emojis per store type

## Requested Changes (Diff)

### Add
- Nothing net-new; this is a clean rebuild

### Modify
- Rebuild all pages from scratch with improved UI quality while keeping all existing functionality
- Homepage: more prominent centered search bar (full-width, visually dominant), 2-column store grid (strict 2-column on all screen sizes, 3-col on large screens)
- Store directory must include all required categories: General Store, Flower Store, Chocolate Store, Grocery Store, Vegetable Store (plus existing extras)
- Product detail page: clearer photo display, description, price, quantity selector, reviews
- Buy Now button: goes directly to checkout (address entry then payment)
- Add to Cart: adds item to cart; cart page shows items, total, proceed to purchase
- Keep existing circular logo in header
- Keep cyan/black color theme

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend with all required store categories seeded (General Store, Flower Store, Chocolate Store, Grocery Store, Vegetable Store + Bakery)
2. Rebuild frontend pages:
   - HomePage: prominent centered search bar below header, 2-column store grid
   - StorePage: organized product grid
   - ProductDetailPage: product image area, description, price, quantity, Buy Now + Add to Cart
   - CartPage: item list, total, proceed to checkout
   - CheckoutPage: address step → payment step (simulated)
   - OrderConfirmedPage: success message
3. Keep Header (circular logo, cart icon), Footer, CartContext, and utility files
4. Ensure all 12 stores appear (6 backend + 6 frontend-only extra stores)
