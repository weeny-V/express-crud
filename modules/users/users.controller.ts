import type { RequestHandler } from 'express';
import type { CreateUserDto } from './dto/create-user.dto.ts';
import UsersService from './users.service.ts';
import type UpdateUserDto from './dto/update-user.dto.ts';

const UsersController = {
    findAll: (async (_req, res) => {
        const users = await UsersService.findAll();
        return res.status(200).json(users);
    }) satisfies RequestHandler,

    create: (async (req, res) => {
        const user = await UsersService.create(req.body as CreateUserDto);
        return res.status(201).json(user);
    }) satisfies RequestHandler,

    findById: (async (req, res) => {
        const user = await UsersService.findById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    }) satisfies RequestHandler,

    update: (async (req, res) => {
        const user = await UsersService.update(
            Number(req.params.id),
            req.body as UpdateUserDto,
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    }) satisfies RequestHandler,

    delete: (async (req, res) => {
        const deleted = await UsersService.delete(Number(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(204).send();
    }) satisfies RequestHandler,
};

export default UsersController;
