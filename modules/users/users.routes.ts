import express from 'express';
import { validateDto } from '../../common/middleware/validate-dto.ts';
import {
    validateIdParam,
    validateUserIdParam,
} from '../../common/middleware/validate-param.ts';
import { CreateUserDto } from './dto/create-user.dto.ts';
import UsersController from './users.controller.ts';
import PartialUpdateUserDto from './dto/partial-update-user.dto.ts';
import UpdateUserDto from './dto/update-user.dto.ts';
import OrdersController from '../orders/orders.controller.ts';

const userRouter = express.Router();

userRouter.get('/', UsersController.findAll);

userRouter.post('/', validateDto(CreateUserDto), UsersController.create);

userRouter.get('/:id', validateIdParam, UsersController.findById);

userRouter.put(
    '/:id',
    validateIdParam,
    validateDto(UpdateUserDto),
    UsersController.update,
);

userRouter.patch(
    '/:id',
    validateIdParam,
    validateDto(PartialUpdateUserDto),
    UsersController.update,
);

userRouter.delete('/:id', validateIdParam, UsersController.delete);

userRouter.get(
    '/:userId/orders',
    validateUserIdParam,
    OrdersController.findOrdersByUser,
);

export default userRouter;
