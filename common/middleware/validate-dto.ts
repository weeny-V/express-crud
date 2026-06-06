import type { RequestHandler } from 'express';
import { validate } from 'class-validator';

type DtoConstructor<T extends object> = new () => T;

export const validateDto = <T extends object>(
    DtoClass: DtoConstructor<T>,
): RequestHandler => {
    return async (req, res, next) => {
        const dto = Object.assign(new DtoClass(), req.body);
        const errors = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
            validationError: {
                target: false,
                value: false,
            },
        });

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.map((error) => ({
                    property: error.property,
                    constraints: Object.values(error.constraints ?? {}),
                })),
            });
        }

        req.body = dto;
        return next();
    };
};
