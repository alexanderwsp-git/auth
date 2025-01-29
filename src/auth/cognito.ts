import {
    CognitoIdentityProviderClient,
    AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

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
