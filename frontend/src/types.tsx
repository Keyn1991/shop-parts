
export interface Part {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}


export interface User {
    id: string;
    username: string;
    role: "admin" | "client";

}