import { Router } from 'express';
import { authenticateUser } from '../auth/cognito';

const router = Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authenticateUser(username, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

export default router;
