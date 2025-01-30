import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    AdminInitiateAuthCommand,
    GlobalSignOutCommand,
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
        console.log(error);
        throw new Error('Cognito registration failed');
    }
};

export const authenticateUser = async (username: string, password: string) => {
    const command = new AdminInitiateAuthCommand({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
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
        console.log(error);
        throw new Error('Authentication failed');
    }
};

export const logoutUser = async (accessToken: string) => {
    const command = new GlobalSignOutCommand({
        AccessToken: accessToken,
    });

    try {
        await cognitoClient.send(command);
        return { message: 'User logged out successfully' };
    } catch (error) {
        console.log(error);
        throw new Error('Logout failed');
    }
};
