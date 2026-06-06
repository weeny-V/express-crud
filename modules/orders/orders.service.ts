import OrdersRepository from './orders.repository.ts';
import type { OrderData, Order, UpdateOrderData } from './orders.types.ts';

const OrdersService = {
    async create(order: OrderData): Promise<Order> {
        return await OrdersRepository.create(order);
    },

    async findAll(): Promise<Order[]> {
        return await OrdersRepository.findAll();
    },

    async findById(id: number): Promise<Order | null> {
        return await OrdersRepository.findById(id);
    },

    async findOrdersByUser(userId: number): Promise<Order[]> {
        return await OrdersRepository.findOrdersByUser(userId);
    },

    async update(id: number, order: UpdateOrderData): Promise<Order | null> {
        return await OrdersRepository.update(id, order);
    },

    async partialUpdate(
        id: number,
        order: Partial<UpdateOrderData>,
    ): Promise<Order | null> {
        return await OrdersRepository.updatePartial(id, order);
    },

    async delete(id: number): Promise<boolean> {
        return await OrdersRepository.delete(id);
    },
};

export default OrdersService;
