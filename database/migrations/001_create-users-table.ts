import type { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
    pgm.createTable('users', {
        id: 'id',
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        email: {
            type: 'varchar(100)',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'varchar(100)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
        },
    });
};

export const down = (pgm: MigrationBuilder): void => {
    pgm.dropTable('users');
};
