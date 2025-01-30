import { Router, Request, Response } from 'express';
import { registerUser, authenticateUser, logoutUser } from '../auth/cognito';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password, email } = req.body;
        const response = await registerUser(username, password, email);
        return res.json(response);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const authResult = await authenticateUser(username, password);
        return res.json(authResult); // ✅ Returns access & refresh tokens
    } catch (error) {
        return res.status(401).json({ error: (error as Error).message });
    }
});

router.post('/logout', async (req: Request, res: Response): Promise<any> => {
    try {
        const { accessToken } = req.body;
        const response = await logoutUser(accessToken);
        return res.json(response);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
