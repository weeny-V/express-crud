import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { app } from '../app.ts';

describe('app', () => {
    let server: Server;
    let baseUrl: string;

    before(async () => {
        await new Promise<void>((resolve) => {
            server = app.listen(0, () => {
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
    });

    it('returns health text from root route', async () => {
        const response = await fetch(`${baseUrl}/`);

        assert.equal(response.status, 200);
        assert.equal(await response.text(), 'Hello World');
    });

    it('returns JSON 404 for unknown routes', async () => {
        const response = await fetch(`${baseUrl}/missing-route`);

        assert.equal(response.status, 404);
        assert.deepEqual(await response.json(), { message: 'Route not found' });
    });
});
