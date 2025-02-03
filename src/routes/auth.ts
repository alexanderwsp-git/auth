import { Router } from 'express';
import { validateSchema } from '../middlewares/validate';
import { asyncHandler } from '../middlewares/asyncHandler';
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
import { cognitoService } from '../auth/cognito';
import { cognitoUserService } from '../auth/cognitoUserService';
import { cognitoPasswordService } from '../auth/cognitoPasswordService';

const router = Router();

// CognitoService
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

// CognitoUserService
router.post(
    '/register',
    validateSchema(AuthSchema),
    asyncHandler(async (req, res) => {
        const { username, password, email } = req.body;
        await cognitoUserService.registerUser(res, username, password, email);
    })
);

router.post(
    '/confirm',
    validateSchema(ConfirmUserSchema),
    asyncHandler(async (req, res) => {
        const { username, confirmationCode } = req.body;
        await cognitoUserService.confirmUser(res, username, confirmationCode);
    })
);

router.get(
    '/users',
    asyncHandler(async (req, res) => {
        await cognitoUserService.listUsers(res);
    })
);

router.get(
    '/user/:username',
    asyncHandler(async (req, res) => {
        await cognitoUserService.findUserById(res, req.params.username);
    })
);

router.put(
    '/user/:username',
    validateSchema(UpdateUserSchema),
    asyncHandler(async (req, res) => {
        await cognitoUserService.updateUserAttributes(
            res,
            req.params.username,
            req.body.attributes
        );
    })
);

router.post(
    '/disable-user',
    validateSchema(DisableUserSchema),
    asyncHandler(async (req, res) => {
        const { username } = req.body;
        await cognitoUserService.disableUser(res, username);
    })
);

// CognitoPasswordService
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
