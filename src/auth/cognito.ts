import {
    AdminInitiateAuthCommand,
    GlobalSignOutCommand,
    GetUserCommand,
    ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Response } from 'express';
import { cognitoClient } from './cognitoHelper';
import { created, failed, ok } from '@awsp__/utils';

class CognitoService {
    private userPoolId: string;
    private clientId: string;

    constructor() {
        this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
        this.clientId = process.env.COGNITO_CLIENT_ID!;
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

        const response = await cognitoClient.send(command);
        if (!response.AuthenticationResult)
            return failed(res, 'Authentication failed');

        ok(res, response.AuthenticationResult, 'User Authenticated');
    }

    async logoutUser(res: Response, accessToken: string) {
        const command = new GlobalSignOutCommand({ AccessToken: accessToken });

        await cognitoClient.send(command);
        ok(res, {}, 'User logged out successfully');
    }

    async refreshToken(res: Response, refreshToken: string) {
        const command = new AdminInitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: this.clientId,
            UserPoolId: this.userPoolId,
            AuthParameters: { REFRESH_TOKEN: refreshToken },
        });

        const response = await cognitoClient.send(command);
        if (!response.AuthenticationResult)
            return failed(res, 'Invalid refresh token');

        created(res, response.AuthenticationResult);
    }

    async verifyEmail(res: Response, accessToken: string) {
        const command = new GetUserCommand({ AccessToken: accessToken });

        const response = await cognitoClient.send(command);
        const emailVerified =
            response.UserAttributes?.find(
                (attr) => attr.Name === 'email_verified'
            )?.Value === 'true';

        const msn = emailVerified
            ? 'Email is verified'
            : 'Email is not verified';
        ok(res, {}, msn);
    }

    async resendConfirmationCode(res: Response, username: string) {
        const command = new ResendConfirmationCodeCommand({
            ClientId: this.clientId,
            Username: username,
        });

        await cognitoClient.send(command);
        ok(res, {}, 'Confirmation code sent successfully!');
    }
}

export const cognitoService = new CognitoService();
