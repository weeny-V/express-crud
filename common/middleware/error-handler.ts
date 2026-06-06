import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';

type PgError = Error & {
    code?: string;
    detail?: string;
};

const isPgError = (error: unknown): error is PgError => {
    return error instanceof Error && 'code' in error;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            details: error.details,
        });
    }

    if (isPgError(error)) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Resource already exists',
                details: error.detail,
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: 'Related resource does not exist',
                details: error.detail,
            });
        }
    }

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
};
