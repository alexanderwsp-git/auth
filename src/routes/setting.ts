import { Router, Request, Response } from 'express';
import { SettingService } from '../services/settingService';

const router = Router();
const settingService = new SettingService();

router.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const setting = await settingService.createSetting(req.body);
        return res.status(201).json(setting);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response): Promise<any> => {
    const settings = await settingService.getAllSettings();
    return res.json({ settings });
});

router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    const setting = await settingService.getSettingById(req.params.id);
    return res.status(200).json({
        success: true,
        data: setting,
    });
});

router.put('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const setting = await settingService.updateSetting(
            req.params.id,
            req.body
        );
        if (!setting) res.status(404).json({ message: 'Setting not found' });
        return res.json(setting);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
    const success = await settingService.deleteSetting(req.params.id);
    if (!success) res.status(404).json({ message: 'Setting not found' });
    return res.status(204).send();
});

export default router;
