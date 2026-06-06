import type { MigrationBuilder } from 'node-pg-migrate';

export const up = async (pgm: MigrationBuilder) => {
    pgm.createTable('products', {
        id: 'id',
        title: {
            type: 'varchar(100)',
            notNull: true,
        },
        description: {
            type: 'text',
            notNull: true,
        },
        price: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        stock: {
            type: 'integer',
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
    pgm.addConstraint('products', 'products_price_positive', {
        check: 'price > 0',
    });
    pgm.addConstraint('products', 'products_stock_not_negative', {
        check: 'stock >= 0',
    });
};

export const down = async (pgm: MigrationBuilder) => {
    pgm.dropTable('products');
};
