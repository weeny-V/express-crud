import UsersRepository from './users.repository.ts';
import type {
    CreateUserData,
    PartialUpdateUserData,
    PublicUser,
    UpdateUserData,
} from './users.types.ts';
import bcrypt from 'bcrypt';

const UsersService = {
    async findAll(): Promise<PublicUser[]> {
        return await UsersRepository.findAll();
    },

    async create(userData: CreateUserData): Promise<PublicUser> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        const user = {
            ...userData,
            password: hashedPassword,
        };
        return await UsersRepository.create(user);
    },

    async findById(id: number): Promise<PublicUser | null> {
        return await UsersRepository.findById(id);
    },

    async update(
        id: number,
        userData: UpdateUserData | PartialUpdateUserData,
    ): Promise<PublicUser | null> {
        return await UsersRepository.update(id, userData);
    },

    async delete(id: number): Promise<boolean> {
        return await UsersRepository.delete(id);
    },
};

export default UsersService;
