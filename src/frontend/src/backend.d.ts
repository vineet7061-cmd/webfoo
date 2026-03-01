import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    username: string;
    displayName: string;
}
export interface Store {
    id: bigint;
    name: string;
    description: string;
    category: string;
}
export interface OrderItem {
    productId: bigint;
    productName: string;
    quantity: bigint;
    price: bigint;
}
export interface OrderDetail {
    id: string;
    status: string;
    total: bigint;
    username: string;
    address: string;
    timestamp: bigint;
    items: Array<OrderItem>;
}
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<OrderDetail>>;
    getAllStores(): Promise<Array<Store>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrdersByUser(username: string): Promise<Array<OrderDetail>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByStore(storeId: bigint): Promise<Array<Product>>;
    getReviews(productId: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(productIds: Array<bigint>, quantities: Array<bigint>, address: string): Promise<string>;
    placeOrderWithUser(username: string, productIds: Array<bigint>, quantities: Array<bigint>, address: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
