import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {
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

  type OldActor = {
    stores : [Store];
    products : [Product];
    nextOrderId : Nat;
  };

  type NewActor = {
    stores : Map.Map<Nat, Store>;
    products : Map.Map<Nat, Product>;
  };

  public func run(old : OldActor) : NewActor {
    let storesMap = Map.fromArray<Nat, Store>(old.stores.map(func(store) { (store.id, store) }));
    let productsMap = Map.fromArray<Nat, Product>(old.products.map(func(product) { (product.id, product) }));
    {
      stores = storesMap;
      products = productsMap;
    };
  };
};
