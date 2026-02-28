import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Store = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
  };

  type Product = {
    id : Nat;
    storeId : Nat;
    name : Text;
    description : Text;
    price : Nat;
  };

  type Review = {
    productId : Nat;
    reviewer : Text;
    rating : Nat;
    comment : Text;
  };

  type Order = {
    id : Text;
    productIds : [Nat];
    quantities : [Nat];
    address : Text;
    timestamp : Int;
  };

  let stores = Map.empty<Nat, Store>();
  let products = Map.empty<Nat, Product>();
  let reviews = Map.empty<Nat, [Review]>();
  let orders = Map.empty<Text, Order>();

  var lastProductId = 24;
  var lastOrderId = 0;

  let initialStores : [Store] = [
    { id = 1; name = "General Store"; description = "Everything you need in one place"; category = "General" },
    { id = 2; name = "Flower Store"; description = "Beautiful flowers for every occasion"; category = "Floral" },
    { id = 3; name = "Chocolate Store"; description = "Delicious chocolates and sweets"; category = "Confectionery" },
    { id = 4; name = "Grocery Store"; description = "Fresh groceries daily"; category = "Food" },
    { id = 5; name = "Vegetable Store"; description = "Wide variety of vegetables"; category = "Food" },
    { id = 6; name = "Bakery"; description = "Freshly baked goods"; category = "Food" },
  ];

  let initialProducts : [Product] = [
    // General Store
    { id = 1; storeId = 1; name = "Notebook"; description = "A5 size, ruled"; price = 299 },
    { id = 2; storeId = 1; name = "Pen Set"; description = "Pack of 5"; price = 199 },
    { id = 3; storeId = 1; name = "Mug"; description = "Ceramic, 300ml"; price = 499 },
    { id = 4; storeId = 1; name = "Candle"; description = "Scented, 200g"; price = 699 },
    // Flower Store
    { id = 5; storeId = 2; name = "Rose Bouquet"; description = "12 red roses"; price = 1499 },
    { id = 6; storeId = 2; name = "Tulip Bunch"; description = "10 assorted tulips"; price = 1299 },
    { id = 7; storeId = 2; name = "Orchid Plant"; description = "Potted, white"; price = 1999 },
    { id = 8; storeId = 2; name = "Flower Basket"; description = "Mixed seasonal flowers"; price = 1799 },
    // Chocolate Store
    { id = 9; storeId = 3; name = "Chocolate Box"; description = "Assorted, 500g"; price = 2499 },
    { id = 10; storeId = 3; name = "Dark Chocolate Bar"; description = "70% cocoa, 100g"; price = 399 },
    { id = 11; storeId = 3; name = "Milk Chocolate"; description = "Smooth, 200g"; price = 499 },
    { id = 12; storeId = 3; name = "Chocolate Truffles"; description = "Pack of 12"; price = 999 },
    // Grocery Store
    { id = 13; storeId = 4; name = "Milk 1L"; description = "Full cream"; price = 149 },
    { id = 14; storeId = 4; name = "Bread Loaf"; description = "Whole wheat"; price = 249 },
    { id = 15; storeId = 4; name = "Eggs"; description = "Dozen, large"; price = 299 },
    { id = 16; storeId = 4; name = "Apples"; description = "Bag of 6"; price = 499 },
    // Vegetable Store
    { id = 17; storeId = 5; name = "Carrots"; description = "500g, fresh"; price = 199 },
    { id = 18; storeId = 5; name = "Lettuce"; description = "Crisp, head"; price = 149 },
    { id = 19; storeId = 5; name = "Tomatoes"; description = "Pack of 4"; price = 299 },
    { id = 20; storeId = 5; name = "Potatoes"; description = "1kg, cleaned"; price = 299 },
    // Bakery
    { id = 21; storeId = 6; name = "Croissant"; description = "Buttery, pack of 4"; price = 599 },
    { id = 22; storeId = 6; name = "Chocolate Cake"; description = "500g, moist"; price = 1299 },
    { id = 23; storeId = 6; name = "Banana Bread"; description = "Loaf, fresh"; price = 899 },
    { id = 24; storeId = 6; name = "Bagel Pack"; description = "6 assorted"; price = 799 },
  ];

  let initialReviews : [(Nat, Review)] = [
    // General Store
    (1, ({ productId = 1; reviewer = "Alice"; rating = 5; comment = "Great quality notebook!" })),
    (1, ({ productId = 1; reviewer = "Bob"; rating = 4; comment = "Useful and affordable" })),
    (2, ({ productId = 2; reviewer = "Carol"; rating = 4; comment = "Good pens, smooth writing" })),
    (2, ({ productId = 2; reviewer = "Dave"; rating = 3; comment = "Some pens ran out quickly" })),
    // ... (continue for other products)
    (24, ({ productId = 24; reviewer = "Yvonne"; rating = 4; comment = "Nice variety and taste" })),
    (24, ({ productId = 24; reviewer = "Zoe"; rating = 5; comment = "Perfect for breakfast" })),
  ];

  public shared ({ caller }) func initialize() : async () {
    if (stores.size() > 0 or products.size() > 0) { return () };

    for (store in initialStores.values()) {
      stores.add(store.id, store);
    };

    for (product in initialProducts.values()) {
      products.add(product.id, product);
    };

    for ((productId, review) in initialReviews.values()) {
      let existingReviews = switch (reviews.get(productId)) {
        case (null) { [] };
        case (?rev) { rev };
      };

      reviews.add(productId, existingReviews.concat([review]));
    };
  };

  public query ({ caller }) func getAllStores() : async [Store] {
    stores.values().toArray();
  };

  public query ({ caller }) func getProductsByStore(storeId : Nat) : async [Product] {
    let iter = products.values().filter(
      func(p) { p.storeId == storeId }
    );
    iter.toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getReviews(productId : Nat) : async [Review] {
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?rev) { rev };
    };
  };

  public shared ({ caller }) func placeOrder(productIds : [Nat], quantities : [Nat], address : Text) : async Text {
    if (productIds.size() != quantities.size()) {
      return "Error: Product and quantity arrays must be of equal length";
    };

    lastOrderId += 1;
    let orderId = "ORD-" # lastOrderId.toText();

    let newOrder : Order = {
      id = orderId;
      productIds;
      quantities;
      address;
      timestamp = Time.now();
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public shared ({ caller }) func _clearStoresForTesting() : async () {
    stores.clear();
    products.clear();
    reviews.clear();
    orders.clear();
    lastProductId := 24;
    lastOrderId := 0;
  };
};
