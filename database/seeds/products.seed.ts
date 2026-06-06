import { pool } from '../../config/db.ts';

export const seedProducts = async () => {
    await pool.query(
        `
        INSERT INTO products (title, description, price, stock)
        VALUES
            ('Product 1', 'Description for Product 1', 19.99, 10),
            ('Product 2', 'Description for Product 2', 29.99, 5),
            ('Product 3', 'Description for Product 3', 14.99, 8);
        `,
    );
};
