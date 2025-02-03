import { Response } from 'express';
import {
    CognitoIdentityProviderClient,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ok } from '../utils/responseHandler';

class CognitoPasswordService {
    private cognitoClient = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
    });
    private clientId = process.env.COGNITO_CLIENT_ID!;

    async forgotPassword(res: Response, username: string) {
        const command = new ForgotPasswordCommand({
            ClientId: this.clientId,
            Username: username,
        });

        await this.cognitoClient.send(command);
        ok(res, {}, 'Password reset code sent successfully!');
    }

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

        await this.cognitoClient.send(command);
        ok(res, {}, 'Password has been reset successfully!');
    }
}

export const cognitoPasswordService = new CognitoPasswordService();
