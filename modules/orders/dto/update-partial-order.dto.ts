import { OrderStatus, type UpdatePartialOrderData } from '../orders.types.ts';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
} from 'class-validator';

class UpdatePartialOrderDto implements UpdatePartialOrderData {
    @IsOptional()
    @IsInt()
    @IsPositive()
    userId: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    totalPrice: number;

    @IsOptional()
    @IsEnum(OrderStatus, {
        message: 'Invalid status',
    })
    status: OrderStatus;
}

export default UpdatePartialOrderDto;
