import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Unit } from '../../../units/entities/unit.entity.js';

export enum RoleScopeMode {
  SELF = 'SELF',
  DESCENDANTS = 'DESCENDANTS',
}

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;

  @ManyToOne(() => Unit, { nullable: false })
  @JoinColumn({ name: 'unit_id' })
  unit!: Unit;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    name: 'scope_mode',
    type: 'enum',
    enum: RoleScopeMode,
    enumName: 'roles_scope_mode_enum',
  })
  scopeMode!: RoleScopeMode;
}
