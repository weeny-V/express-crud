import { pool } from '../../config/db.ts';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
    const passwordHash = await bcrypt.hash('1234', 10);

    await pool.query(
        `
            INSERT INTO users (name, email, password)
            VALUES 
                ('User_1', 'example1@email.com', $1),
                ('User_2', 'example2@email.com', $1),
                ('User_3', 'example3@email.com', $1)
            ON CONFLICT (email) DO NOTHING;
        `,
        [passwordHash],
    );
};
