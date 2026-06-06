import type { UpdateUserData } from '../users.types.ts';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

class UpdateUserDto implements UpdateUserData {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;
}

export default UpdateUserDto;
