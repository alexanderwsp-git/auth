import { AppDataSource } from '../config/ormconfig';
import { Setting } from '../entities/setting';
import { Repository } from 'typeorm';

export class SettingRepository {
    private repository: Repository<Setting>;

    constructor() {
        this.repository = AppDataSource.getRepository(Setting);
    }

    async create(settingData: Partial<Setting>): Promise<Setting> {
        const setting = this.repository.create(settingData);
        return this.repository.save(setting);
    }

    async findAll(): Promise<Setting[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<Setting | null> {
        return this.repository.findOne({ where: { id } });
    }

    async update(
        id: string,
        settingData: Partial<Setting>
    ): Promise<Setting | null> {
        const setting = await this.findById(id);
        if (!setting) return null;

        Object.assign(setting, settingData);
        return this.repository.save(setting);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}
