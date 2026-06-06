import type { MigrationBuilder } from 'node-pg-migrate';

export const up = async (pgm: MigrationBuilder) => {
    pgm.createTable('orders', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users(id)',
            onDelete: 'RESTRICT',
        },
        total_price: {
            type: 'numeric(10,2)',
            notNull: true,
        },
        status: {
            type: 'varchar',
            notNull: true,
            default: 'new',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.addConstraint('orders', 'orders_total_price_positive', {
        check: 'total_price > 0',
    });
    pgm.addConstraint('orders', 'orders_status_valid', {
        check: "status IN ('new', 'paid', 'shipped', 'cancelled')",
    });
    pgm.createIndex('orders', 'user_id');
};

export const down = async (pgm: MigrationBuilder) => {
    pgm.dropTable('orders');
};
