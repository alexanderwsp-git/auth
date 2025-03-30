import { Response } from 'express';
import {
    SignUpCommand,
    ConfirmSignUpCommand,
    AdminGetUserCommand,
    AdminUpdateUserAttributesCommand,
    AdminDisableUserCommand,
    ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { cognitoClient } from './cognitoHelper';
import { created, found, ok, updated } from '@awsp__/utils';

class CognitoUserService {
    private userPoolId = process.env.COGNITO_USER_POOL_ID!;
    private clientId = process.env.COGNITO_CLIENT_ID!;

    async registerUser(res: Response, username: string, password: string, email: string) {
        const command = new SignUpCommand({
            ClientId: this.clientId,
            Username: username,
            Password: password,
            UserAttributes: [{ Name: 'email', Value: email }],
        });

        await cognitoClient.send(command);
        created(res, { message: 'User registered successfully!' });
    }

    async listUsers(res: Response, limit: number = 10) {
        const command = new ListUsersCommand({
            UserPoolId: this.userPoolId,
            Limit: limit,
        });

        const response = await cognitoClient.send(command);
        found(res, response.Users || []);
    }

    async findUserById(res: Response, userId: string) {
        const command = new AdminGetUserCommand({
            UserPoolId: this.userPoolId,
            Username: userId,
        });

        const response = await cognitoClient.send(command);
        found(res, response);
    }

    async confirmUser(res: Response, username: string, confirmationCode: string) {
        const command = new ConfirmSignUpCommand({
            ClientId: this.clientId,
            Username: username,
            ConfirmationCode: confirmationCode,
        });

        await cognitoClient.send(command);
        ok(res, {}, 'User confirmed successfully!');
    }

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

        await cognitoClient.send(command);
        updated(res, { username, attributes });
    }

    async disableUser(res: Response, username: string) {
        const command = new AdminDisableUserCommand({
            UserPoolId: this.userPoolId,
            Username: username,
        });

        await cognitoClient.send(command);
        ok(res, {}, 'User has been disabled successfully!');
    }
}

export const cognitoUserService = new CognitoUserService();
