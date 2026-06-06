import { Router } from 'express';
import { validateDto } from '../../common/middleware/validate-dto.ts';
import CreateOrderDto from './dto/create-order.dto.ts';
import OrdersController from './orders.controller.ts';
import { validateIdParam } from '../../common/middleware/validate-param.ts';
import UpdateOrderDto from './dto/update-order.dto.ts';
import UpdatePartialOrderDto from './dto/update-partial-order.dto.ts';

const orderRouter = Router();

orderRouter.post('/', validateDto(CreateOrderDto), OrdersController.create);

orderRouter.get('/', OrdersController.findAll);

orderRouter.get('/:id', validateIdParam, OrdersController.findById);

orderRouter.put(
    '/:id',
    validateIdParam,
    validateDto(UpdateOrderDto),
    OrdersController.update,
);

orderRouter.patch(
    '/:id',
    validateIdParam,
    validateDto(UpdatePartialOrderDto),
    OrdersController.updatePartial,
);

orderRouter.delete('/:id', validateIdParam, OrdersController.delete);

export default orderRouter;
