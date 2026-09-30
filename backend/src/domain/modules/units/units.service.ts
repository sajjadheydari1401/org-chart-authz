import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { Unit } from './entities/unit.entity.js';
import { deleteUnitSubtree } from './utils/delete-unit-subtree.js';
import { getParentWithoutCycle } from './utils/unit-hierarchy.js';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  getAllUnits(): Promise<Unit[]> {
    return this.units.find();
  }

  async getSingleUnit(id: number): Promise<Unit> {
    const unit = await this.units.findOneBy({ id });
    if (!unit) throw new NotFoundException();
    return unit;
  }

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
      await this.applyParentChange(updatedUnit, input.parentId);
    }

    return this.units.save(updatedUnit);
  }

  async moveUnit(id: number, parentId: number | null): Promise<Unit> {
    const unit = await this.units.findOneBy({ id });
    if (!unit) throw new NotFoundException();

    await this.applyParentChange(unit, parentId);
    return this.units.save(unit);
  }

  async deleteUnit(id: number): Promise<void> {
    const unit = await this.units.findOne({
      where: { id },
      relations: { parent: true },
    });

    if (!unit) throw new NotFoundException();
    if (isRootUnit(unit)) {
      throw new NotFoundException('Root unit cannot be deleted.');
    }

    await deleteUnitSubtree(this.dataSource, id);
  }

  private async applyParentChange(
    unit: Unit,
    parentId: number | null,
  ): Promise<void> {
    // Null moves the unit to the root; an ID must resolve to a valid parent.
    unit.parent =
      parentId === null
        ? null
        : await getParentWithoutCycle(this.units, unit.id, parentId);
  }
}

function isRootUnit(unit: Pick<Unit, 'parent'>): boolean {
  return unit.parent === null || unit.parent === undefined;
}
