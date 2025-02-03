import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    AdminInitiateAuthCommand,
    GlobalSignOutCommand,
    ListUsersCommand,
    AdminGetUserCommand,
    AdminUpdateUserAttributesCommand,
    ConfirmSignUpCommand,
    GetUserCommand,
    ResendConfirmationCodeCommand,
    AdminDisableUserCommand,
    ConfirmForgotPasswordCommand,
    ForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { logger } from '../middlewares/logger';
import {
    created,
    failed,
    found,
    ok,
    serverError,
    updated,
} from '../utils/responseHandler';
import { Response } from 'express';

class CognitoService {
    private cognitoClient: CognitoIdentityProviderClient;
    private userPoolId: string;
    private clientId: string;

    constructor() {
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: process.env.AWS_REGION,
        });
        this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
        this.clientId = process.env.COGNITO_CLIENT_ID!;
    }

    async registerUser(
        res: Response,
        username: string,
        password: string,
        email: string
    ) {
        const command = new SignUpCommand({
            ClientId: this.clientId,
            Username: username,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }],
        });

        try {
            await this.cognitoClient.send(command);
            return created(res, { message: 'User registered successfully!' });
        } catch (error) {
            logger.error('Cognito registration failed', error);
            return serverError(res, error);
        }
    }

    async authenticateUser(res: Response, username: string, password: string) {
        const command = new AdminInitiateAuthCommand({
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            ClientId: this.clientId,
            UserPoolId: this.userPoolId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        });

        try {
            const response = await this.cognitoClient.send(command);
            if (!response.AuthenticationResult) {
                return failed(res, 'Authentication failed');
            }
            return found(res, response.AuthenticationResult);
        } catch (error) {
            logger.error('Authentication failed', error);
            return serverError(res, error);
        }
    }

    async logoutUser(res: Response, accessToken: string) {
        const command = new GlobalSignOutCommand({ AccessToken: accessToken });

        try {
            await this.cognitoClient.send(command);
            return created(res, { message: 'User logged out successfully' });
        } catch (error) {
            logger.error('Logout failed', error);
            return serverError(res, error);
        }
    }

    async listUsers(res: Response, limit: number = 10) {
        const command = new ListUsersCommand({
            UserPoolId: this.userPoolId,
            Limit: limit,
        });

        try {
            const response = await this.cognitoClient.send(command);
            return found(res, response.Users || []);
        } catch (error) {
            logger.error('Failed to list users', error);
            return serverError(res, error);
        }
    }

    async findUserById(res: Response, userId: string) {
        const command = new AdminGetUserCommand({
            UserPoolId: this.userPoolId,
            Username: userId,
        });

        try {
            const response = await this.cognitoClient.send(command);
            return found(res, response);
        } catch (error) {
            logger.error(`User not found: ${userId}`, error);
            return failed(res, 'User not found');
        }
    }

    async refreshToken(res: Response, refreshToken: string) {
        const command = new AdminInitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: this.clientId,
            UserPoolId: this.userPoolId,
            AuthParameters: { REFRESH_TOKEN: refreshToken },
        });

        try {
            const response = await this.cognitoClient.send(command);
            if (!response.AuthenticationResult) {
                return failed(res, 'Invalid refresh token');
            }
            return created(res, response.AuthenticationResult);
        } catch (error) {
            logger.error('Refresh token failed', error);
            return serverError(res, error);
        }
    }

    // ✅ Update User Attributes
    async updateUserAttributes(
        res: Response,
        username: string,
        attributes: { Name: string; Value: string }[]
    ) {
        const command = new AdminUpdateUserAttributesCommand({
            UserPoolId: this.userPoolId,
            Username: username,
            UserAttributes: attributes,
        });

        try {
            await this.cognitoClient.send(command);
            return updated(res, { username, attributes });
        } catch (error) {
            logger.error(`Failed to update user: ${username}`, error);
            return serverError(res, error);
        }
    }

    async confirmUser(
        res: Response,
        username: string,
        confirmationCode: string
    ) {
        const command = new ConfirmSignUpCommand({
            ClientId: this.clientId,
            Username: username,
            ConfirmationCode: confirmationCode,
        });

        try {
            await this.cognitoClient.send(command);

            return ok(res, {}, 'User confirmed successfully!');
        } catch (error) {
            logger.error('User confirmation failed', error);
            return serverError(res, error);
        }
    }

    // ✅ Verify Email (Check if email is verified)
    async verifyEmail(res: Response, accessToken: string) {
        const command = new GetUserCommand({ AccessToken: accessToken });

        try {
            const response = await this.cognitoClient.send(command);
            const emailVerified =
                response.UserAttributes?.find(
                    (attr) => attr.Name === 'email_verified'
                )?.Value === 'true';

            const msn = emailVerified
                ? 'Email is verified'
                : 'Email is not verified';

            return ok(res, {}, msn);
        } catch (error) {
            logger.error('Email verification check failed', error);
            return serverError(res, error);
        }
    }

    async resendConfirmationCode(res: Response, username: string) {
        const command = new ResendConfirmationCodeCommand({
            ClientId: this.clientId,
            Username: username,
        });

        try {
            await this.cognitoClient.send(command);

            return ok(res, {}, 'Confirmation code sent successfully!');
        } catch (error) {
            logger.error('Failed to resend confirmation code', error);
            return serverError(res, error);
        }
    }

    async forgotPassword(res: Response, username: string) {
        const command = new ForgotPasswordCommand({
            ClientId: this.clientId,
            Username: username,
        });

        try {
            await this.cognitoClient.send(command);

            return ok(res, {}, 'Password reset code sent successfully!');
        } catch (error) {
            logger.error('Failed to send password reset code', error);
            return serverError(res, error);
        }
    }

    // ✅ Reset Password (Confirm New Password)
    async resetPassword(
        res: Response,
        username: string,
        confirmationCode: string,
        newPassword: string
    ) {
        const command = new ConfirmForgotPasswordCommand({
            ClientId: this.clientId,
            Username: username,
            ConfirmationCode: confirmationCode,
            Password: newPassword,
        });

        try {
            await this.cognitoClient.send(command);

            return ok(res, {}, 'Password has been reset successfully!');
        } catch (error) {
            logger.error('Password reset failed', error);
            return serverError(res, error);
        }
    }

    // ✅ Disable User
    async disableUser(res: Response, username: string) {
        const command = new AdminDisableUserCommand({
            UserPoolId: this.userPoolId,
            Username: username,
        });

        try {
            await this.cognitoClient.send(command);

            return ok(res, {}, 'User has been disabled successfully!');
        } catch (error) {
            logger.error(`Failed to disable user: ${username}`, error);
            return serverError(res, error);
        }
    }
}

export const cognitoService = new CognitoService();
