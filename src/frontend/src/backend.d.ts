import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    productId: bigint;
    comment: string;
    rating: bigint;
    reviewer: string;
}
export interface Product {
    id: bigint;
    storeId: bigint;
    name: string;
    description: string;
    price: bigint;
}
export interface Store {
    id: bigint;
    name: string;
    description: string;
    category: string;
}
export interface backendInterface {
    getAllStores(): Promise<Array<Store>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByStore(storeId: bigint): Promise<Array<Product>>;
    getReviews(_productId: bigint): Promise<Array<Review>>;
    placeOrder(_productIds: Array<bigint>, _quantities: Array<bigint>, _address: string): Promise<string>;
}
