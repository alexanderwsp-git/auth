import { AppDataSource } from '../config/ormconfig';
import { Param } from '../entities/param';
import { Repository } from 'typeorm';

export class ParamRepository {
    private repository: Repository<Param>;

    constructor() {
        this.repository = AppDataSource.getRepository(Param);
    }

    async create(paramData: Partial<Param>): Promise<Param> {
        const param = this.repository.create(paramData);
        return this.repository.save(param);
    }

    async findAll(): Promise<Param[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<Param | null> {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: string, paramData: Partial<Param>): Promise<Param | null> {
        const param = await this.findById(id);
        if (!param) return null;

        Object.assign(param, paramData);
        return this.repository.save(param);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}
