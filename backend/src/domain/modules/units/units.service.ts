import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { Unit } from './entities/unit.entity.js';
import { getParentWithoutCycle } from './utils/unit-hierarchy.js';

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

  async updateUnit(id: number, input: UpdateUnitDto): Promise<Unit> {
    const unit = await this.units.findOneBy({ id });
    if (!unit) throw new NotFoundException();

    const updatedUnit: Unit = {
      ...unit,
      ...(input.name !== undefined && { name: input.name }),
      ...(input.type !== undefined && { type: input.type }),
    };

    if (input.parentId !== undefined) {
      // Null clears the parent; an ID must resolve to a valid parent.
      updatedUnit.parent =
        input.parentId === null
          ? null
          : await getParentWithoutCycle(this.units, id, input.parentId);
    }

    return this.units.save(updatedUnit);
  }
}
