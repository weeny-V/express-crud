export enum OrderStatus {
    NEW = 'new',
    PAID = 'paid',
    SHIPPED = 'shipped',
    CANCELLED = 'cancelled',
}

export interface Order {
    id: number;
    userId: number;
    totalPrice: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type OrderData = Pick<Order, 'userId' | 'totalPrice'>;
export type UpdateOrderData = OrderData & Pick<Order, 'status'>;
export type UpdatePartialOrderData = Partial<UpdateOrderData>;
