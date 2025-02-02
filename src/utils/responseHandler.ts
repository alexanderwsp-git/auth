import { Response } from 'express';

export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T | null = null,
    error: string | null = null
): void => {
    res.status(statusCode).json({ error, message, data, success: !error });
};

export const created = <T>(res: Response, data: T | null): void =>
    sendResponse(res, 201, 'Resource created successfully', data);

export const found = <T>(res: Response, data: T | null): void =>
    sendResponse(res, 200, 'Resource found', data);

export const updated = <T>(res: Response, data: T | null): void =>
    sendResponse(res, 200, 'Resource updated successfully', data);

export const deleted = (res: Response): void =>
    sendResponse(res, 204, 'Resource deleted successfully', null);

export const failed = (
    res: Response,
    error: unknown,
    message = 'Request failed'
): void => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendResponse(res, 207, message, null, errorMessage);
};

export const serverError = (res: Response, error: unknown): void => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendResponse(res, 500, 'Internal server error', null, errorMessage);
};
