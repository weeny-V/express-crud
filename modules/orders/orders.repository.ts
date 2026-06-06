import { pool } from '../../config/db.ts';
import type { OrderData, Order, UpdateOrderData } from './orders.types.ts';

const OrdersRepository = {
    async create(order: OrderData): Promise<Order> {
        const result = await pool.query<Order>(
            `INSERT INTO orders (user_id, total_price)
                VALUES ($1, $2)
                RETURNING id, user_id AS "userId", total_price::float AS "totalPrice", status, created_at AS "createdAt", updated_at AS "updatedAt"
            `,
            [order.userId, order.totalPrice],
        );
        return result.rows[0]!;
    },

    async findAll(): Promise<Order[]> {
        const result = await pool.query<Order>(
            `SELECT id, user_id AS "userId", total_price::float AS "totalPrice", status, created_at AS "createdAt", updated_at AS "updatedAt"
                FROM orders
            `,
        );
        return result.rows;
    },

    async findById(id: number): Promise<Order | null> {
        const result = await pool.query<Order>(
            `SELECT id, user_id AS "userId", total_price::float AS "totalPrice", status, created_at AS "createdAt", updated_at AS "updatedAt"
                FROM orders
                WHERE id = $1
            `,
            [id],
        );
        return result.rows[0] ?? null;
    },

    async findOrdersByUser(userId: number): Promise<Order[]> {
        const result = await pool.query<Order>(
            `SELECT id, user_id AS "userId", total_price::float AS "totalPrice", status, created_at AS "createdAt", updated_at AS "updatedAt"
                FROM orders
                WHERE user_id = $1
            `,
            [userId],
        );
        return result.rows;
    },

    async update(id: number, order: UpdateOrderData): Promise<Order | null> {
        const result = await pool.query<Order>(
            `
            UPDATE orders
            SET user_id = $1, total_price = $2, status = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, user_id AS "userId", total_price::float AS "totalPrice", status, created_at AS "createdAt", updated_at AS "updatedAt"
        `,
            [order.userId, order.totalPrice, order.status, id],
        );
        return result.rows[0] ?? null;
    },

    async updatePartial(
        id: number,
        order: Partial<UpdateOrderData>,
    ): Promise<Order | null> {
        const result = await pool.query<Order>(
            `
            UPDATE orders
            SET user_id = COALESCE($1, user_id), total_price = COALESCE($2, total_price), status = COALESCE($3, status), updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, user_id AS "userId", total_price::float AS "totalPrice", status, created_at AS "createdAt", updated_at AS "updatedAt"
        `,
            [order.userId, order.totalPrice, order.status, id],
        );
        return result.rows[0] ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await pool.query<{ id: number }>(
            `DELETE FROM orders
            WHERE id = $1
            RETURNING id`,
            [id],
        );
        return (result.rowCount ?? 0) > 0;
    },
};

export default OrdersRepository;
