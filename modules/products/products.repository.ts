import type { ProductData, Product } from './products.types.ts';
import { pool } from '../../config/db.ts';

const ProductsRepository = {
    async create(product: ProductData): Promise<Product> {
        const result = await pool.query<Product>(
            `INSERT INTO products (title, description, price, stock)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, description, price::float AS price, stock, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [product.title, product.description, product.price, product.stock],
        );

        return result.rows[0]!;
    },

    async findAll(): Promise<Product[]> {
        const result = await pool.query<Product>(
            `SELECT id, title, description, price::float AS price, stock, created_at AS "createdAt", updated_at AS "updatedAt"
             FROM products`,
        );
        return result.rows;
    },

    async findById(id: number): Promise<Product | null> {
        const result = await pool.query<Product>(
            `SELECT id, title, description, price::float AS price, stock, created_at AS "createdAt", updated_at AS "updatedAt"
            FROM products
            WHERE id = $1`,
            [id],
        );

        return result.rows[0] || null;
    },

    async update(id: number, product: ProductData): Promise<Product | null> {
        const result = await pool.query<Product>(
            `UPDATE products
            SET title = $1, description = $2, price = $3, stock = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, title, description, price::float AS price, stock, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [
                product.title,
                product.description,
                product.price,
                product.stock,
                id,
            ],
        );

        return result.rows[0] ?? null;
    },

    async partialUpdate(
        id: number,
        product: Partial<ProductData>,
    ): Promise<Product | null> {
        const result = await pool.query<Product>(
            `UPDATE products
            SET title = COALESCE($1, title), description = COALESCE($2, description), price = COALESCE($3, price), stock = COALESCE($4, stock), updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, title, description, price::float AS price, stock, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [
                product.title,
                product.description,
                product.price,
                product.stock,
                id,
            ],
        );

        return result.rows[0] ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await pool.query<{ id: number }>(
            `DELETE FROM products
            WHERE id = $1
            RETURNING id`,
            [id],
        );

        return (result.rowCount ?? 0) > 0;
    },
};

export default ProductsRepository;
