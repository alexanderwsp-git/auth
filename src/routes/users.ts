import { Router } from 'express';
import { cognitoUserService } from '../auth/cognitoUserService';
import {
    asyncHandler,
    AuthSchema,
    ConfirmUserSchema,
    DisableUserSchema,
    UpdateUserSchema,
    validateSchema,
} from '@awsp__/utils';

const router = Router();

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
    '/',
    asyncHandler(async (req, res) => {
        await cognitoUserService.listUsers(res);
    })
);

router.get(
    '/:username',
    asyncHandler(async (req, res) => {
        await cognitoUserService.findUserById(res, req.params.username);
    })
);

router.put(
    '/:username',
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

export default router;
