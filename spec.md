# WebFoo Mart

## Current State
- Full e-commerce site with homepage (12-store grid), individual store pages, product detail pages, cart, checkout (address + card payment), order confirmed page
- Admin panel at /admin (password: webfoo@admin2026) with: Orders tab, Manage Stores tab, Manage Products tab
- Customer login/registration with localStorage-based auth
- My Orders page for logged-in customers
- All orders/stores/products stored in localStorage
- Currency displayed in USD ($)
- Address form: Full Name, Street, City, ZIP
- Payment form: Card number, expiry, CVV
- No delete functionality for stores, products, or cart items (admin)
- No out-of-stock marking for products
- No Customers tab in admin panel

## Requested Changes (Diff)

### Add
- Delete option for stores in admin Manage Stores tab
- Delete option for products in admin Manage Products tab
- Delete option for cart items in the Cart page (already partially present via cart context, ensure visible button)
- "Mark Out of Stock" toggle for products in admin Manage Products tab
- Out-of-stock badge displayed on product cards and product detail pages; "Add to Cart" and "Buy Now" disabled when out of stock
- Customers tab in admin panel showing all registered users (name, login ID, password stored in localStorage KNOWN_USERS_KEY)
- Phone number field on the address/delivery step in CheckoutPage
- Cash on Delivery as only payment method (replace card payment form)
- Currency changed from USD ($) to INR (₹) everywhere

### Modify
- `formatPrice` in `categoryColors.ts`: change from `$` to `₹` and from dividing by 100 to displaying as-is (prices are already in rupees in the backend seed data)
- `CheckoutPage`: add phone number field to address form; replace card payment step with Cash on Delivery confirmation step
- `localStores.ts`: add `deleteLocalStore`, `deleteLocalProduct`, `setProductOutOfStock` utilities
- `localOrders.ts`: no changes needed
- `AuthContext.tsx`: expose `getKnownUsers` for admin customers tab (or read directly from localStorage key)
- `useQueries.ts`: add `useDeleteStore`, `useDeleteProduct`, `useToggleProductOutOfStock` hooks
- `AdminPage.tsx`: add delete buttons to store rows and product rows; add out-of-stock toggle; add Customers tab
- `ProductDetailPage.tsx`: show out-of-stock badge; disable Add to Cart / Buy Now if out of stock
- `StorePage.tsx`: show out-of-stock badge on product cards if product is marked out of stock
- Price label in `AdminPage.tsx` ProductForm: change "Price (in $)" to "Price (in ₹)" and remove /100 division

### Remove
- Card payment form (card number, expiry, CVV fields) from CheckoutPage
- Credit card step indicator label; replace with "Payment" showing Cash on Delivery

## Implementation Plan
1. Update `categoryColors.ts` formatPrice: change symbol to ₹, display price directly (no /100 division since backend seeds use integer rupee values like 299, 499, etc.)
2. Update `localStores.ts`: add `deleteLocalStore`, `deleteLocalProduct`, `markProductOutOfStock`, `isProductOutOfStock` utilities; add `outOfStock` field to LocalProduct
3. Update `useQueries.ts`: add `useDeleteStore`, `useDeleteProduct`, `useToggleProductOutOfStock` mutation hooks
4. Update `CheckoutPage.tsx`: add phone field to AddressForm; replace payment step with Cash on Delivery step; remove card payment logic; update addressValid to include phone
5. Update `AdminPage.tsx`: 
   - Add delete button to each store row (with confirmation)
   - Add delete + out-of-stock toggle to each product row
   - Add Customers tab showing all registered users from localStorage
   - Update price label from $ to ₹ in ProductForm
6. Update `ProductDetailPage.tsx`: show out-of-stock badge; disable Add to Cart / Buy Now if out of stock
7. Update `StorePage.tsx`: pass out-of-stock flag to product cards; show badge
8. Verify no TypeScript errors and build succeeds
