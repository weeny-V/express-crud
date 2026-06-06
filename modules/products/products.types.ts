export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductData = Pick<
    Product,
    'title' | 'description' | 'price' | 'stock'
>;
export type UpdatePartialProductData = Partial<ProductData>;
