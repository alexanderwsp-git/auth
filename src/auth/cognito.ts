import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

export const registerUser = async (
    username: string,
    password: string,
    email: string
) => {
    const command = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: 'email', Value: email }],
    });

    try {
        await cognitoClient.send(command);
        return { message: 'User registered successfully!' };
    } catch (error) {
        throw new Error('Cognito registration failed');
    }
};

export const authenticateUser = async (username: string, password: string) => {
    const command = new AdminInitiateAuthCommand({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_CLIENT_ID!,
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    });

    try {
        const response = await cognitoClient.send(command);
        return response.AuthenticationResult;
    } catch (error) {
        throw new Error('Authentication failed');
    }
};
