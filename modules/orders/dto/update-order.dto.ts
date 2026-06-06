import { OrderStatus, type UpdateOrderData } from '../orders.types.ts';
import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';

class UpdateOrderDto implements UpdateOrderData {
    @IsInt()
    @IsPositive()
    userId: number;

    @IsNumber()
    @IsPositive()
    totalPrice: number;

    @IsEnum(OrderStatus, {
        message: 'Invalid status',
    })
    status: OrderStatus;
}

export default UpdateOrderDto;
