import type { OrderData } from '../orders.types.ts';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

class CreateOrderDto implements OrderData {
    @IsInt()
    @IsPositive()
    userId: number;

    @IsNumber()
    @IsPositive()
    totalPrice: number;
}

export default CreateOrderDto;
