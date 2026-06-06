import type { ProductData } from '../products.types.ts';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

class CreateProductDto implements ProductData {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(1000)
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    stock: number;
}
export default CreateProductDto;
