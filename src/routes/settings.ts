import { Router, Request, Response } from 'express';
import { SettingService } from '../services/settingService';

import {
    asyncHandler,
    created,
    deleted,
    failed,
    found,
    IdSchema,
    SettingPartialSchema,
    SettingSchema,
    updated,
    validateParams,
    validateSchema,
} from '@awsp__/utils';

const router = Router();
const settingService = new SettingService();

router.post(
    '/',
    validateSchema(SettingSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const setting = await settingService.createSetting(req.body);
        created(res, setting);
    })
);

router.get(
    '/',
    asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { page, limit, name, type, status } = req.query;

        const settings =
            page && limit
                ? await settingService.getPaginatedSettings(Number(page), Number(limit), {
                      name,
                      type,
                      status,
                  })
                : await settingService.getAllSettings();

        found(res, settings);
    })
);

router.get(
    '/:id',
    validateParams(IdSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const setting = await settingService.getSettingById(req.params.id);
        if (!setting) return failed(res, 'Setting not found');
        found(res, setting);
    })
);

router.put(
    '/:id',
    validateParams(IdSchema),
    validateSchema(SettingPartialSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const setting = await settingService.updateSetting(req.params.id, req.body);
        if (!setting) return failed(res, 'Setting not found');
        updated(res, setting);
    })
);

router.delete(
    '/:id',
    validateParams(IdSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const success = await settingService.deleteSetting(req.params.id);
        if (!success) return failed(res, 'Setting not found');
        deleted(res);
    })
);

export default router;
