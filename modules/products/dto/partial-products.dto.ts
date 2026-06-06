import type { UpdatePartialProductData } from '../products.types.ts';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

class UpdatePartialProductsDto implements UpdatePartialProductData {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    stock?: number;
}

export default UpdatePartialProductsDto;
