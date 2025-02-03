import { Router } from 'express';
import { validateSchema } from '../middlewares/validate';
import { asyncHandler } from '../middlewares/asyncHandler';
import { cognitoService } from '../auth/cognito';
import {
    AccessTokenSchema,
    AuthSchema,
    ConfirmUserSchema,
    DisableUserSchema,
    ForgotPasswordSchema,
    RefreshTokenSchema,
    ResendConfirmationSchema,
    ResetPasswordSchema,
    UpdateUserSchema,
} from '../validation/authSchema';

const router = Router();

router.post(
    '/register',
    validateSchema(AuthSchema),
    asyncHandler(async (req, res) => {
        const { username, password, email } = req.body;
        await cognitoService.registerUser(res, username, password, email);
    })
);

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

router.get(
    '/users',
    asyncHandler(async (req, res) => {
        await cognitoService.listUsers(res);
    })
);

router.get(
    '/user/:username',
    asyncHandler(async (req, res) => {
        await cognitoService.findUserById(res, req.params.username);
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

router.put(
    '/user/:username',
    validateSchema(UpdateUserSchema),
    asyncHandler(async (req, res) => {
        await cognitoService.updateUserAttributes(
            res,
            req.params.username,
            req.body.attributes
        );
    })
);

router.post(
    '/confirm',
    validateSchema(ConfirmUserSchema),
    asyncHandler(async (req, res) => {
        const { username, confirmationCode } = req.body;
        await cognitoService.confirmUser(res, username, confirmationCode);
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

router.post(
    '/forgot-password',
    validateSchema(ForgotPasswordSchema),
    asyncHandler(async (req, res) => {
        const { username } = req.body;
        await cognitoService.forgotPassword(res, username);
    })
);

// ✅ Reset Password
router.post(
    '/reset-password',
    validateSchema(ResetPasswordSchema),
    asyncHandler(async (req, res) => {
        const { username, confirmationCode, newPassword } = req.body;
        await cognitoService.resetPassword(
            res,
            username,
            confirmationCode,
            newPassword
        );
    })
);

// ✅ Disable User
router.post(
    '/disable-user',
    validateSchema(DisableUserSchema),
    asyncHandler(async (req, res) => {
        const { username } = req.body;
        await cognitoService.disableUser(res, username);
    })
);

export default router;
