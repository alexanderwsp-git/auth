import { Router } from 'express';
import { cognitoPasswordService } from '../auth/cognitoPasswordService';
import {
    asyncHandler,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    validateSchema,
} from '@awsp__/utils';

const router = Router();

router.post(
    '/forgot-password',
    validateSchema(ForgotPasswordSchema),
    asyncHandler(async (req, res) => {
        const { username } = req.body;
        await cognitoPasswordService.forgotPassword(res, username);
    })
);

router.post(
    '/reset-password',
    validateSchema(ResetPasswordSchema),
    asyncHandler(async (req, res) => {
        const { username, confirmationCode, newPassword } = req.body;
        await cognitoPasswordService.resetPassword(
            res,
            username,
            confirmationCode,
            newPassword
        );
    })
);

export default router;
