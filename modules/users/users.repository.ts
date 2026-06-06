import { pool } from '../../config/db.ts';
import type {
    CreateUserData,
    PartialUpdateUserData,
    PublicUser,
    UpdateUserData,
} from './users.types.ts';

const UsersRepository = {
    async findById(id: number): Promise<PublicUser | null> {
        const result = await pool.query<PublicUser>(
            `SELECT id, name, email, created_at AS "createdAt", updated_at AS "updatedAt"
             FROM users
             WHERE id = $1`,
            [id],
        );
        return result.rows[0] || null;
    },

    async findAll(): Promise<PublicUser[]> {
        const result = await pool.query<PublicUser>(
            `SELECT id, name, email, created_at AS "createdAt", updated_at AS "updatedAt"
             FROM users`,
        );
        return result.rows;
    },

    async create(user: CreateUserData): Promise<PublicUser> {
        const result = await pool.query<PublicUser>(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [user.name, user.email, user.password],
        );

        return result.rows[0]!;
    },

    async update(
        id: number,
        user: UpdateUserData | PartialUpdateUserData,
    ): Promise<PublicUser | null> {
        const result = await pool.query<PublicUser>(
            `UPDATE users
            SET name = COALESCE($1, name), email = COALESCE($2, email)
            WHERE id = $3
            RETURNING id, name, email, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [user.name ?? null, user.email ?? null, id],
        );

        return result.rows[0] ?? null;
    },

    async delete(id: number): Promise<boolean> {
        const result = await pool.query<{ id: number }>(
            `DELETE FROM users
            WHERE id = $1
            RETURNING id`,
            [id],
        );

        return (result.rowCount ?? 0) > 0;
    },
};

export default UsersRepository;
