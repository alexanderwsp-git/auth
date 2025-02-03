import { Router } from 'express';
import { validateSchema } from '../middlewares/validate';
import { asyncHandler } from '../middlewares/asyncHandler';
import {
    AccessTokenSchema,
    AuthSchema,
    RefreshTokenSchema,
    ResendConfirmationSchema,
} from '../validation/authSchema';
import { cognitoService } from '../auth/cognito';

const router = Router();

router.post(
    '/login',
    validateSchema(AuthSchema),
    asyncHandler(async (req, res) => {
        const { username, password } = req.body;
        await cognitoService.authenticateUser(res, username, password);
    })
);

router.post(
    '/logout',
    asyncHandler(async (req, res) => {
        const { accessToken } = req.body;
        await cognitoService.logoutUser(res, accessToken);
    })
);

router.post(
    '/refresh',
    validateSchema(RefreshTokenSchema),
    asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        await cognitoService.refreshToken(res, refreshToken);
    })
);

router.get(
    '/verify-email',
    validateSchema(AccessTokenSchema),
    asyncHandler(async (req, res) => {
        const { accessToken } = req.query;
        await cognitoService.verifyEmail(res, accessToken as string);
    })
);

router.post(
    '/resend-confirmation-code',
    validateSchema(ResendConfirmationSchema),
    asyncHandler(async (req, res) => {
        const { username } = req.body;
        await cognitoService.resendConfirmationCode(res, username);
    })
);

export default router;
