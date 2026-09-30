import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { Unit } from './entities/unit.entity.js';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
  ) {}

  async createUnit(input: CreateUnitDto): Promise<Unit> {
    const parent = input.parentId
      ? await this.units.findOneBy({ id: input.parentId })
      : null;

    if (input.parentId && !parent) throw new NotFoundException();

    return this.units.save(
      this.units.create({
        name: input.name,
        type: input.type,
        parent,
      }),
    );
  }
}
