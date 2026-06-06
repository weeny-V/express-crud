import { pool } from '../../config/db.ts';
import { seedUsers } from './users.seed.ts';
import { seedProducts } from './products.seed.ts';
import { seedOrders } from './orders.seed.ts';

const runSeeds = async () => {
    try {
        await seedUsers();
        await seedProducts();
        await seedOrders();
        console.log('Seeds executed successfully');
    } catch (error) {
        console.error('Seeds failed:', error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

runSeeds();
