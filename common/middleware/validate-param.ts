import type { RequestHandler } from 'express';

export const validateNumericParam = (paramName: string): RequestHandler => {
    return (req, res, next) => {
        const value = req.params[paramName];

        if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
            return res.status(400).json({
                message: 'Invalid route parameter',
                errors: [
                    {
                        property: paramName,
                        constraints: [
                            `${paramName} must be a positive integer`,
                        ],
                    },
                ],
            });
        }

        return next();
    };
};

export const validateIdParam = validateNumericParam('id');
export const validateUserIdParam = validateNumericParam('userId');
