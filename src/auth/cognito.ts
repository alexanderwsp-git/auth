import {
    AdminInitiateAuthCommand,
    GlobalSignOutCommand,
    GetUserCommand,
    ResendConfirmationCodeCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Response } from 'express';
import { cognitoClient } from './cognitoHelper';
import { created, failed, ok, createEmailService } from '@alexanderwsp-git/awsp-utils';

class CognitoService {
    private userPoolId: string;
    private clientId: string;
    private emailService: any;

    constructor() {
        this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
        this.clientId = process.env.COGNITO_CLIENT_ID!;
        // Initialize email service
        this.emailService = createEmailService({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASS!,
            },
        });
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
        if (!response.AuthenticationResult) return failed(res, 'Authentication failed');

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
        if (!response.AuthenticationResult) return failed(res, 'Invalid refresh token');

        created(res, response.AuthenticationResult);
    }

    async verifyEmail(res: Response, accessToken: string) {
        const command = new GetUserCommand({ AccessToken: accessToken });

        const response = await cognitoClient.send(command);
        const emailVerified =
            response.UserAttributes?.find(attr => attr.Name === 'email_verified')?.Value === 'true';

        const msn = emailVerified ? 'Email is verified' : 'Email is not verified';
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


    async registerUser(res: Response, username: string, email: string, password: string) {
        const command = new SignUpCommand({
            ClientId: this.clientId,
            Username: username,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
            ],
        });

        try {
            const response = await cognitoClient.send(command);
            
            // Generate confirmation link with username
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const confirmationLink = `${frontendUrl}/confirm-registration?username=${username}`;
            
            // Send confirmation email in background (fire-and-forget)
            this.emailService.sendConfirmationEmail(
                process.env.EMAIL_FROM || 'noreply@yourapp.com',
                email,
                username,
                confirmationLink
            ).catch((error: any) => {
                console.log({
                    message: 'Sending confirmation email',
                    email,
                    username,
                    confirmationLink
                });
                console.error('Background email sending failed:', error);
                // Email failure doesn't affect registration success
            });
            
            ok(res, { 
                userSub: response.UserSub,
                confirmationLink: confirmationLink,
            }, 'User registered successfully. Please check your email for confirmation link.');
        } catch (error: any) {
            if (error.name === 'UsernameExistsException') {
                return failed(res, 'Username already exists');
            }
            if (error.name === 'InvalidPasswordException') {
                return failed(res, 'Password does not meet requirements');
            }
            if (error.name === 'InvalidParameterException') {
                return failed(res, 'Invalid parameters provided');
            }
            return failed(res, 'Registration failed');
        }
    }

    async confirmRegistration(res: Response, username: string, confirmationCode: string) {
        const command = new ConfirmSignUpCommand({
            ClientId: this.clientId,
            Username: username,
            ConfirmationCode: confirmationCode,
        });

        try {
            await cognitoClient.send(command);
            ok(res, {}, 'Email confirmed successfully! You can now login.');
        } catch (error: any) {
            if (error.name === 'CodeMismatchException') {
                return failed(res, 'Invalid confirmation code');
            }
            if (error.name === 'ExpiredCodeException') {
                return failed(res, 'Confirmation code has expired');
            }
            if (error.name === 'NotAuthorizedException') {
                return failed(res, 'User is already confirmed');
            }
            return failed(res, 'Confirmation failed');
        }
    }
}

export const cognitoService = new CognitoService();
