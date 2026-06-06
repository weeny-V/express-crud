export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateUserData = Pick<User, 'name' | 'email' | 'password'>;
export type PartialUpdateUserData = Partial<Omit<CreateUserData, 'password'>>;
export type UpdateUserData = Omit<CreateUserData, 'password'>;
export type PublicUser = Omit<User, 'password'>;
