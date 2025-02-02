import { Request, Response, NextFunction } from 'express';
import { serverError } from '../utils/responseHandler';
import { logger } from './logger';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(`${error.message}`);
    serverError(res, error.message);
};
