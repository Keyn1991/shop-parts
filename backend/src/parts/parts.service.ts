import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from './parts.entity';

@Injectable()
export class PartsService {
    constructor(
        @InjectRepository(Part)
        private partsRepository: Repository<Part>,
    ) {}

    findAll(): Promise<Part[]> {
        return this.partsRepository.find();
    }

    async findOne(id: number): Promise<Part> {
        const part = await this.partsRepository.findOne({ where: { id } });
        if (!part) {
            throw new NotFoundException(`Part with ID ${id} not found`);
        }
        return part;
    }

    async create(part: Partial<Part>): Promise<Part> {
        const newPart = this.partsRepository.create(part);
        return this.partsRepository.save(newPart);
    }

    async update(id: number, updateData: Partial<Part>): Promise<Part> {
        await this.partsRepository.update(id, updateData);
        const updatedPart = await this.findOne(id); // Проверяем, существует ли объект после обновления
        return updatedPart;
    }

    async delete(id: number): Promise<void> {
        const part = await this.findOne(id); // Проверяем перед удалением
        await this.partsRepository.delete(id);
    }

    async purchase(id: number, quantity: number): Promise<Part> {
        const part = await this.findOne(id);

        if (part.stock < quantity) {
            throw new BadRequestException('Not enough stock available');
        }

        part.stock -= quantity;
        return this.partsRepository.save(part);
    }
}
