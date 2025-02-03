import {
    CognitoIdentityProviderClient,
    AdminInitiateAuthCommand,
    GlobalSignOutCommand,
    GetUserCommand,
    ResendConfirmationCodeCommand,
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

        const response = await this.cognitoClient.send(command);
        if (!response.AuthenticationResult)
            return failed(res, 'Authentication failed');

        ok(res, response.AuthenticationResult, 'User Authenticated');
    }

    async logoutUser(res: Response, accessToken: string) {
        const command = new GlobalSignOutCommand({ AccessToken: accessToken });

        await this.cognitoClient.send(command);
        ok(res, {}, 'User logged out successfully');
    }

    async refreshToken(res: Response, refreshToken: string) {
        const command = new AdminInitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: this.clientId,
            UserPoolId: this.userPoolId,
            AuthParameters: { REFRESH_TOKEN: refreshToken },
        });

        const response = await this.cognitoClient.send(command);
        if (!response.AuthenticationResult)
            return failed(res, 'Invalid refresh token');

        created(res, response.AuthenticationResult);
    }

    async verifyEmail(res: Response, accessToken: string) {
        const command = new GetUserCommand({ AccessToken: accessToken });

        const response = await this.cognitoClient.send(command);
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

        await this.cognitoClient.send(command);
        ok(res, {}, 'Confirmation code sent successfully!');
    }
}

export const cognitoService = new CognitoService();
