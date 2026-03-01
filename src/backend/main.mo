import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


// Specify the data migration function in with-clause

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
    username : Text;
    userId : Principal;
    productIds : [Nat];
    quantities : [Nat];
    address : Text;
    timestamp : Int;
    status : Text;
  };

  type OrderItem = {
    productId : Nat;
    productName : Text;
    price : Nat;
    quantity : Nat;
  };

  type OrderDetail = {
    id : Text;
    username : Text;
    items : [OrderItem];
    address : Text;
    total : Nat;
    timestamp : Int;
    status : Text;
  };

  public type UserProfile = {
    username : Text;
    displayName : Text;
  };

  let lastStoreId = 12;
  var lastProductId = 48;
  var lastOrderId = 0;

  let stores = Map.empty<Nat, Store>();
  let products = Map.empty<Nat, Product>();
  let reviews = Map.empty<Nat, [Review]>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let initialStores = [
    (1, "General Store", "Everything you need in one place", "General"),
    (2, "Flower Store", "Beautiful flowers for every occasion", "Floral"),
    (3, "Chocolate Store", "Delicious chocolates and sweets", "Confectionery"),
    (4, "Grocery Store", "Fresh groceries daily", "Food"),
    (5, "Vegetable Store", "Wide variety of vegetables", "Food"),
    (6, "Bakery", "Freshly baked goods", "Food"),
    (7, "Pet Store", "Supplies for your furry friends", "Pets"),
    (8, "Toy Store", "Fun toys for all ages", "Toys"),
    (9, "Sports Store", "Equipment for every sport", "Sports"),
    (10, "Electronics Store", "Latest gadgets and devices", "Electronics"),
    (11, "Clothing Store", "Fashion for everyone", "Clothing"),
    (12, "Book Store", "A world of books", "Books"),
  ];

  let initialProducts = [
    (1, 1, "Notebook", "A5 size, ruled", 299),
    (2, 1, "Pen Set", "Pack of 5", 199),
    (3, 1, "Mug", "Ceramic, 300ml", 499),
    (4, 1, "Candle", "Scented, 200g", 699),
    (5, 2, "Rose Bouquet", "12 red roses", 1499),
    (6, 2, "Tulip Bunch", "10 assorted tulips", 1299),
    (7, 2, "Orchid Plant", "Potted, white", 1999),
    (8, 2, "Flower Basket", "Mixed seasonal flowers", 1799),
    (9, 3, "Chocolate Box", "Assorted, 500g", 2499),
    (10, 3, "Dark Chocolate Bar", "70% cocoa, 100g", 399),
    (11, 3, "Milk Chocolate", "Smooth, 200g", 499),
    (12, 3, "Chocolate Truffles", "Pack of 12", 999),
    (13, 4, "Milk 1L", "Full cream", 149),
    (14, 4, "Bread Loaf", "Whole wheat", 249),
    (15, 4, "Eggs", "Dozen, large", 299),
    (16, 4, "Apples", "Bag of 6", 499),
    (17, 5, "Carrots", "500g, fresh", 199),
    (18, 5, "Lettuce", "Crisp, head", 149),
    (19, 5, "Tomatoes", "Pack of 4", 299),
    (20, 5, "Potatoes", "1kg, cleaned", 299),
    (21, 6, "Croissant", "Buttery, pack of 4", 599),
    (22, 6, "Chocolate Cake", "500g, moist", 1299),
    (23, 6, "Banana Bread", "Loaf, fresh", 899),
    (24, 6, "Bagel Pack", "6 assorted", 799),
    (25, 7, "Dog Food", "10kg, premium blend", 4999),
    (26, 7, "Cat Litter", "5kg, scented", 1599),
    (27, 7, "Bird Cage", "Medium size, metal", 2999),
    (28, 7, "Aquarium Set", "Complete kit, 20L", 3999),
    (29, 8, "Action Figure", "Superhero edition", 1299),
    (30, 8, "Puzzle Set", "500 pieces, landscapes", 999),
    (31, 8, "Board Game", "Family edition", 2499),
    (32, 8, "Toy Car", "Remote controlled", 1599),
    (33, 9, "Basketball", "Official size", 1999),
    (34, 9, "Tennis Racket", "Lightweight, graphite", 2999),
    (35, 9, "Football", "Professional grade", 2499),
    (36, 9, "Yoga Mat", "Non-slip, 5mm", 1499),
    (37, 10, "Smartphone", "Latest model, 128GB", 34999),
    (38, 10, "Laptop", "Ultra-thin, 15 inch", 59999),
    (39, 10, "Bluetooth Speaker", "Portable, waterproof", 4999),
    (40, 10, "Headphones", "Noise-cancelling", 3999),
    (41, 11, "Jeans", "Men's, slim fit", 1499),
    (42, 11, "Dress", "Women's, summer style", 1999),
    (43, 11, "T-shirt", "Unisex, cotton", 799),
    (44, 11, "Jacket", "Winter, insulated", 2999),
    (45, 12, "Fiction Novel", "Best-seller, hardcover", 999),
    (46, 12, "Cookbook", "International recipes", 1199),
    (47, 12, "Children's Book", "Illustrated, ages 3-7", 799),
    (48, 12, "Travel Guide", "Top destinations", 1399),
  ];

  let initialReviews : [(Nat, Review)] = [
    // General Store
    (1, ({ productId = 1; reviewer = "Alice"; rating = 5; comment = "Great quality notebook!" })),
    (1, ({ productId = 1; reviewer = "Bob"; rating = 4; comment = "Useful and affordable" })),
    (2, ({ productId = 2; reviewer = "Carol"; rating = 4; comment = "Good pens, smooth writing" })),
    (2, ({ productId = 2; reviewer = "Dave"; rating = 3; comment = "Some pens ran out quickly" })),
    (3, ({ productId = 3; reviewer = "Eve"; rating = 5; comment = "Love the mug design" })),
    (3, ({ productId = 3; reviewer = "Frank"; rating = 4; comment = "Good size and quality" })),
    (4, ({ productId = 4; reviewer = "Grace"; rating = 4; comment = "Nice scent, calming" })),
    (4, ({ productId = 4; reviewer = "Heidi"; rating = 3; comment = "Burns quickly" })),
    // ... (continue for other products)
    (24, ({ productId = 24; reviewer = "Yvonne"; rating = 4; comment = "Nice variety and taste" })),
    (24, ({ productId = 24; reviewer = "Zoe"; rating = 5; comment = "Perfect for breakfast" })),
  ];

  public shared ({ caller }) func initialize() : async () {
    if (stores.size() > 0 or products.size() > 0) { return () };

    for ((id, name, description, category) in initialStores.values()) {
      let store : Store = {
        id;
        name;
        description;
        category;
      };
      stores.add(id, store);
    };

    for ((id, storeId, name, description, price) in initialProducts.values()) {
      let product : Product = {
        id;
        storeId;
        name;
        description;
        price;
      };
      products.add(id, product);
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
      username = "anonymous";
      userId = caller;
      productIds;
      quantities;
      address;
      timestamp = Time.now();
      status = "pending";
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public shared ({ caller }) func placeOrderWithUser(username : Text, productIds : [Nat], quantities : [Nat], address : Text) : async Text {
    if (productIds.size() != quantities.size()) {
      return "Error: Product and quantity arrays must be of equal length";
    };

    lastOrderId += 1;
    let orderId = "ORD-" # lastOrderId.toText();

    let newOrder : Order = {
      id = orderId;
      username;
      userId = caller;
      productIds;
      quantities;
      address;
      timestamp = Time.now();
      status = "pending";
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public query ({ caller }) func getOrdersByUser(username : Text) : async [OrderDetail] {
    let userOrders = orders.values().filter(
      func(order) { order.username == username }
    );
    userOrders.map(convertOrderToDetail).toArray();
  };

  public query ({ caller }) func getAllOrders() : async [OrderDetail] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all orders");
    };
    orders.values().map(convertOrderToDetail).toArray();
  };

  func convertOrderToDetail(order : Order) : OrderDetail {
    var total = 0;
    let itemsList = List.empty<OrderItem>();

    for (i in Nat.range(0, order.productIds.size())) {
      let productId = order.productIds[i];
      let quantity = order.quantities[i];
      let productName = switch (products.get(productId)) {
        case (?product) { product.name };
        case (null) { "Unknown" };
      };
      let price = switch (products.get(productId)) {
        case (?product) { product.price };
        case (null) { 0 };
      };
      total += price * quantity;

      let item : OrderItem = {
        productId = productId;
        productName;
        price;
        quantity;
      };
      itemsList.add(item);
    };

    {
      id = order.id;
      username = order.username;
      items = itemsList.toArray();
      address = order.address;
      total;
      timestamp = order.timestamp;
      status = order.status;
    };
  };

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Users can view their own profile, admins can view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func _clearStoresForTesting() : async () {
    stores.clear();
    products.clear();
    reviews.clear();
    orders.clear();
    lastProductId := 48;
    lastOrderId := 0;
  };
};
