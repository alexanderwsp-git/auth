import { Router } from 'express';
import { registerUser, authenticateUser } from '../auth/cognito';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const response = await registerUser(username, password, email);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await authenticateUser(username, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.get('/hola', async (req, res) => {
    res.json({ token: 'hola' });
});

export default router;
