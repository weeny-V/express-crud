import { pool } from '../../config/db.ts';

export const seedOrders = async () => {
    await pool.query(`
        INSERT INTO orders (user_id, total_price, status)
        VALUES 
            ((SELECT id FROM users WHERE email = 'example1@email.com'), 100, 'new'),
            ((SELECT id FROM users WHERE email = 'example2@email.com'), 150, 'paid'),
            ((SELECT id FROM users WHERE email = 'example3@email.com'), 200, 'shipped')
    `);
};
