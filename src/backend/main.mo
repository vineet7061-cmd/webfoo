import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  type Store = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
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

  let stores : [Store] = [
    { id = 1; name = "TechZone"; category = "Electronics"; description = "Latest gadgets and devices" },
    { id = 2; name = "HomeEssentials"; category = "Home & Garden"; description = "Everything for your home" },
    { id = 3; name = "FashionFiesta"; category = "Clothing"; description = "Trendy and stylish apparel" },
    { id = 4; name = "BookBarn"; category = "Books"; description = "Wide range of books and genres" },
    { id = 5; name = "SportsHub"; category = "Sports"; description = "Sports equipment and accessories" },
    { id = 6; name = "BeautyBox"; category = "Beauty"; description = "Beauty products and skincare" },
  ];

  let products : [Product] = [
    // TechZone Products
    { id = 1; storeId = 1; name = "Smartphone X"; description = "Latest model smartphone"; price = 899 },
    { id = 2; storeId = 1; name = "Wireless Headphones"; description = "Noise-cancelling headphones"; price = 199 },
    { id = 3; storeId = 1; name = "4K TV"; description = "Ultra HD television"; price = 1299 },
    { id = 4; storeId = 1; name = "Smart Watch"; description = "Fitness tracker watch"; price = 299 },
    // HomeEssentials Products
    { id = 5; storeId = 2; name = "Vacuum Cleaner"; description = "High power vacuum"; price = 349 },
    { id = 6; storeId = 2; name = "Cookware Set"; description = "Non-stick kitchen set"; price = 149 },
    { id = 7; storeId = 2; name = "Garden Tools"; description = "Complete gardening kit"; price = 99 },
    { id = 8; storeId = 2; name = "LED Lamp"; description = "Smart home lighting"; price = 49 },
    // FashionFiesta Products
    { id = 9; storeId = 3; name = "Denim Jacket"; description = "Trendy winter wear"; price = 79 },
    { id = 10; storeId = 3; name = "Sneakers"; description = "Comfortable running shoes"; price = 59 },
    { id = 11; storeId = 3; name = "Summer Dress"; description = "Light fabric dress"; price = 39 },
    { id = 12; storeId = 3; name = "Beanie Hat"; description = "Warm winter hat"; price = 19 },
    // BookBarn Products
    { id = 13; storeId = 4; name = "Mystery Novel"; description = "Thrilling crime story"; price = 15 },
    { id = 14; storeId = 4; name = "Science Textbook"; description = "Comprehensive science guide"; price = 49 },
    { id = 15; storeId = 4; name = "History Novel"; description = "Engaging historical account"; price = 29 },
    { id = 16; storeId = 4; name = "Children's Book"; description = "Illustrated story for kids"; price = 12 },
    // SportsHub Products
    { id = 17; storeId = 5; name = "Tennis Racket"; description = "Professional grade racket"; price = 89 },
    { id = 18; storeId = 5; name = "Soccer Ball"; description = "Official match ball"; price = 39 },
    { id = 19; storeId = 5; name = "Yoga Mat"; description = "Non-slip workout mat"; price = 25 },
    { id = 20; storeId = 5; name = "Water Bottle"; description = "Insulated sports bottle"; price = 15 },
    // BeautyBox Products
    { id = 21; storeId = 6; name = "Skincare Set"; description = "Complete facial care"; price = 129 },
    { id = 22; storeId = 6; name = "Hair Dryer"; description = "Fast drying technology"; price = 59 },
    { id = 23; storeId = 6; name = "Makeup Kit"; description = "All-in-one makeup solution"; price = 79 },
    { id = 24; storeId = 6; name = "Perfume"; description = "Long-lasting fragrance"; price = 99 },
  ];

  var nextOrderId = 1;

  // Query functions
  public query ({ caller }) func getAllStores() : async [Store] {
    stores;
  };

  public query ({ caller }) func getProductsByStore(storeId : Nat) : async [Product] {
    products.filter(func(p) { p.storeId == storeId });
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.find(func(p) { p.id == id });
  };

  public query ({ caller }) func getReviews(_productId : Nat) : async [Review] {
    [];
  };

  // Update function
  public shared ({ caller }) func placeOrder(_productIds : [Nat], _quantities : [Nat], _address : Text) : async Text {
    let orderId = "ORD-" # nextOrderId.toText();
    nextOrderId += 1;
    orderId;
  };
};
