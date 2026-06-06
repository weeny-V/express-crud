import type { Product, ProductData } from './products.types.ts';
import ProductsRepository from './products.repository.ts';

const ProductsService = {
    async create(productData: ProductData): Promise<Product> {
        return await ProductsRepository.create(productData);
    },

    async findAll(): Promise<Product[]> {
        return await ProductsRepository.findAll();
    },

    async findById(id: number): Promise<Product | null> {
        return await ProductsRepository.findById(id);
    },

    async update(
        id: number,
        productData: ProductData,
    ): Promise<Product | null> {
        return await ProductsRepository.update(id, productData);
    },

    async partialUpdate(
        id: number,
        productData: Partial<ProductData>,
    ): Promise<Product | null> {
        return await ProductsRepository.partialUpdate(id, productData);
    },

    async delete(id: number): Promise<boolean> {
        return await ProductsRepository.delete(id);
    },
};

export default ProductsService;
