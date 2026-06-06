import type { RequestHandler } from 'express';
import OrdersService from './orders.service.ts';
import CreateOrderDto from './dto/create-order.dto.ts';

const OrdersController = {
    create: (async (req, res) => {
        const order = await OrdersService.create(req.body as CreateOrderDto);
        return res.status(201).json({
            order,
        });
    }) satisfies RequestHandler,

    findAll: (async (_req, res) => {
        const orders = await OrdersService.findAll();
        return res.status(200).json({
            orders,
        });
    }) satisfies RequestHandler,

    findById: (async (req, res) => {
        const order = await OrdersService.findById(Number(req.params.id));
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json({
            order,
        });
    }) satisfies RequestHandler,

    findOrdersByUser: (async (req, res) => {
        const orders = await OrdersService.findOrdersByUser(
            Number(req.params.userId),
        );
        return res.status(200).json({
            orders,
        });
    }) satisfies RequestHandler,

    update: (async (req, res) => {
        const order = await OrdersService.update(
            Number(req.params.id),
            req.body,
        );
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json({
            order,
        });
    }) satisfies RequestHandler,

    updatePartial: (async (req, res) => {
        const order = await OrdersService.partialUpdate(
            Number(req.params.id),
            req.body,
        );
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json({
            order,
        });
    }) satisfies RequestHandler,

    delete: (async (req, res) => {
        const deleted = await OrdersService.delete(Number(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(204).send();
    }) satisfies RequestHandler,
};

export default OrdersController;
