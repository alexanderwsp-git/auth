import { Router, Request, Response } from 'express';
import { ParamService } from '../services/paramService';

const router = Router();
const paramService = new ParamService();

router.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const param = await paramService.createParam(req.body);
        return res.status(201).json(param);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response): Promise<any> => {
    const params = await paramService.getAllParams();
    return res.json({ params });
});

router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    const param = await paramService.getParamById(req.params.id);
    return res.status(200).json({
        success: true,
        data: param,
    });
});

router.put('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const param = await paramService.updateParam(req.params.id, req.body);
        if (!param) res.status(404).json({ message: 'Param not found' });
        return res.json(param);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});

router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
    const success = await paramService.deleteParam(req.params.id);
    if (!success) res.status(404).json({ message: 'Param not found' });
    return res.status(204).send();
});

export default router;
