import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { Pool } from 'pg';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

const canResetDatabase = (databaseUrl: string) => {
    return (
        databaseUrl.toLowerCase().includes('test') ||
        process.env.ALLOW_INTEGRATION_DB_RESET === 'true'
    );
};

const integrationTest = testDatabaseUrl
    ? describe
    : describe.skip.bind(describe);

type JsonObject = Record<string, unknown>;

const requestJson = async (
    baseUrl: string,
    path: string,
    options: RequestInit = {},
) => {
    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...options.headers,
        },
    });

    if (response.status === 204) {
        return { response, body: null };
    }

    return {
        response,
        body: (await response.json()) as JsonObject,
    };
};

const resetDatabase = async (pool: Pool) => {
    await pool.query('DROP TABLE IF EXISTS orders');
    await pool.query('DROP TABLE IF EXISTS products');
    await pool.query('DROP TABLE IF EXISTS users');

    await pool.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC(10,2) NOT NULL CHECK (price > 0),
            stock INTEGER NOT NULL CHECK (stock >= 0),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
            status VARCHAR NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'paid', 'shipped', 'cancelled')),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

integrationTest(
    'CRUD integration',
    { skip: testDatabaseUrl ? false : 'Set TEST_DATABASE_URL to run DB tests' },
    () => {
        let server: Server;
        let baseUrl: string;
        let pool: Pool;

        before(async () => {
            assert(testDatabaseUrl);
            assert(
                canResetDatabase(testDatabaseUrl),
                'TEST_DATABASE_URL must contain "test" or ALLOW_INTEGRATION_DB_RESET=true must be set',
            );

            process.env.DATABASE_URL = testDatabaseUrl;

            const appModule = await import('../../app.ts');
            const dbModule = await import('../../config/db.ts');

            pool = dbModule.pool;
            await resetDatabase(pool);

            await new Promise<void>((resolve) => {
                server = appModule.app.listen(0, () => {
                    resolve();
                });
            });

            const address = server.address();
            assert(address && typeof address === 'object');
            baseUrl = `http://127.0.0.1:${address.port}`;
        });

        after(async () => {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });

            await pool.end();
        });

        it('creates, reads, updates, and deletes a user', async () => {
            const createResult = await requestJson(baseUrl, '/api/v1/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Ada Lovelace',
                    email: 'ada@example.com',
                    password: 'password123',
                }),
            });

            assert.equal(createResult.response.status, 201);
            assert.equal(createResult.body?.email, 'ada@example.com');
            assert.equal('password' in createResult.body!, true);

            const userId = createResult.body?.id;
            assert.equal(typeof userId, 'number');

            const readResult = await requestJson(
                baseUrl,
                `/api/v1/users/${userId}`,
            );
            assert.equal(readResult.response.status, 200);
            assert.equal(readResult.body?.name, 'Ada Lovelace');

            const patchResult = await requestJson(
                baseUrl,
                `/api/v1/users/${userId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ name: 'Ada Byron' }),
                },
            );
            assert.equal(patchResult.response.status, 200);
            assert.equal(patchResult.body?.name, 'Ada Byron');

            const deleteResult = await requestJson(
                baseUrl,
                `/api/v1/users/${userId}`,
                { method: 'DELETE' },
            );
            assert.equal(deleteResult.response.status, 204);

            const missingResult = await requestJson(
                baseUrl,
                `/api/v1/users/${userId}`,
            );
            assert.equal(missingResult.response.status, 404);
        });

        it('returns validation and conflict errors for users', async () => {
            const invalidResult = await requestJson(baseUrl, '/api/v1/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'A',
                    email: 'not-email',
                    password: 'short',
                }),
            });
            assert.equal(invalidResult.response.status, 400);

            const payload = {
                name: 'Grace Hopper',
                email: 'grace@example.com',
                password: 'password123',
            };

            const firstResult = await requestJson(baseUrl, '/api/v1/users', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            const duplicateResult = await requestJson(
                baseUrl,
                '/api/v1/users',
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
            );

            assert.equal(firstResult.response.status, 201);
            assert.equal(duplicateResult.response.status, 409);
        });

        it('creates, reads, updates, and deletes a product', async () => {
            const createResult = await requestJson(
                baseUrl,
                '/api/v1/products',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: 'Keyboard',
                        description: 'Mechanical keyboard',
                        price: 120.5,
                        stock: 7,
                    }),
                },
            );

            assert.equal(createResult.response.status, 201);
            const product = createResult.body?.product as JsonObject;
            assert.equal(product.title, 'Keyboard');
            assert.equal(product.price, 120.5);

            const productId = product.id;
            assert.equal(typeof productId, 'number');

            const readResult = await requestJson(
                baseUrl,
                `/api/v1/products/${productId}`,
            );
            assert.equal(readResult.response.status, 200);

            const patchResult = await requestJson(
                baseUrl,
                `/api/v1/products/${productId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ stock: 10 }),
                },
            );
            assert.equal(patchResult.response.status, 200);
            const patchedProduct = patchResult.body?.product;
            assert(patchedProduct && typeof patchedProduct === 'object');
            assert.equal((patchedProduct as JsonObject).stock, 10);

            const deleteResult = await requestJson(
                baseUrl,
                `/api/v1/products/${productId}`,
                { method: 'DELETE' },
            );
            assert.equal(deleteResult.response.status, 204);
        });

        it('returns validation errors for invalid product payloads', async () => {
            const invalidResult = await requestJson(
                baseUrl,
                '/api/v1/products',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: 'A',
                        description: 'x',
                        price: -1,
                        stock: -3,
                    }),
                },
            );

            assert.equal(invalidResult.response.status, 400);
        });

        it('creates, reads, updates, and deletes an order', async () => {
            const userResult = await requestJson(baseUrl, '/api/v1/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Order User',
                    email: 'orders-user@example.com',
                    password: 'password123',
                }),
            });
            const userId = userResult.body?.id;

            const createResult = await requestJson(baseUrl, '/api/v1/orders', {
                method: 'POST',
                body: JSON.stringify({
                    userId,
                    totalPrice: 45.25,
                }),
            });

            assert.equal(createResult.response.status, 201);
            const order = createResult.body?.order as JsonObject;
            assert.equal(order.userId, userId);
            assert.equal(order.status, 'new');

            const orderId = order.id;
            assert.equal(typeof orderId, 'number');

            const patchResult = await requestJson(
                baseUrl,
                `/api/v1/orders/${orderId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'paid' }),
                },
            );
            assert.equal(patchResult.response.status, 200);
            const patchedOrder = patchResult.body?.order;
            assert(patchedOrder && typeof patchedOrder === 'object');
            assert.equal((patchedOrder as JsonObject).status, 'paid');

            const byUserResult = await requestJson(
                baseUrl,
                `/api/v1/users/${userId}/orders`,
            );
            assert.equal(byUserResult.response.status, 200);
            assert.equal(Array.isArray(byUserResult.body?.orders), true);

            const deleteResult = await requestJson(
                baseUrl,
                `/api/v1/orders/${orderId}`,
                { method: 'DELETE' },
            );
            assert.equal(deleteResult.response.status, 204);
        });

        it('returns errors for invalid order scenarios', async () => {
            const invalidStatusResult = await requestJson(
                baseUrl,
                '/api/v1/orders/1',
                {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'lost' }),
                },
            );
            assert.equal(invalidStatusResult.response.status, 400);

            const missingUserResult = await requestJson(
                baseUrl,
                '/api/v1/orders',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: 999999,
                        totalPrice: 10,
                    }),
                },
            );
            assert.equal(missingUserResult.response.status, 400);
        });
    },
);
