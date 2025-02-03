import { z } from 'zod';

export const AuthSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    email: z.string().email('Invalid email format').optional(),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(10, 'Refresh token is required'),
});

export const UpdateUserSchema = z.object({
    attributes: z
        .array(
            z.object({
                Name: z.string(),
                Value: z.string(),
            })
        )
        .min(1, 'At least one attribute is required'),
});

export const ConfirmUserSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    confirmationCode: z.string().min(6, 'Confirmation code is required'),
});

export const AccessTokenSchema = z.object({
    accessToken: z.string().min(10, 'Access token is required'),
});

export const ResendConfirmationSchema = z.object({
    username: z.string().min(3, 'Username is required'),
});

export const ForgotPasswordSchema = z.object({
    username: z.string().min(3, 'Username is required'),
});

export const ResetPasswordSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    confirmationCode: z.string().min(6, 'Confirmation code is required'),
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters'),
});

export const DisableUserSchema = z.object({
    username: z.string().min(3, 'Username is required'),
});
