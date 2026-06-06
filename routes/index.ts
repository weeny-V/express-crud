import express from 'express';
import userRouter from '../modules/users/users.routes.ts';
import productRouter from '../modules/products/product.routes.ts';
import orderRouter from '../modules/orders/orders.routes.ts';

const router = express.Router();

router.use('/users', userRouter);

router.use('/products', productRouter);

router.use('/orders', orderRouter);

export default router;
