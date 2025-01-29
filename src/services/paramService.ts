import { ParamRepository } from '../repositories/paramRepository';
import { Param } from '../entities/param';

export class ParamService {
    private paramRepository = new ParamRepository();

    async createParam(data: Partial<Param>): Promise<Param> {
        return this.paramRepository.create(data);
    }

    async getAllParams(): Promise<Param[]> {
        return this.paramRepository.findAll();
    }

    async getParamById(id: string): Promise<Param | null> {
        return this.paramRepository.findById(id);
    }

    async updateParam(id: string, data: Partial<Param>): Promise<Param | null> {
        return this.paramRepository.update(id, data);
    }

    async deleteParam(id: string): Promise<boolean> {
        return this.paramRepository.delete(id);
    }
}
