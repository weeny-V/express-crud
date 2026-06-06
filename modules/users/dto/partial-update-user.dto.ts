import type { PartialUpdateUserData } from '../users.types.ts';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

class PartialUpdateUserDto implements PartialUpdateUserData {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email?: string;
}

export default PartialUpdateUserDto;
