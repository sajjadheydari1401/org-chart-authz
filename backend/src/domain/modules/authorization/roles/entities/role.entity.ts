import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Unit } from '../../../units/entities/unit.entity.js';

export enum RoleScopeMode {
  SELF = 'SELF',
  DESCENDANTS = 'DESCENDANTS',
}

@Entity({ name: 'roles' })
@Index('IDX_roles_unit_id', ['unit'])
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;

  @ManyToOne(() => Unit, { nullable: false })
  @JoinColumn({ name: 'unit_id' })
  unit!: Unit;

  // Exposes the existing unit_id; this adds no database column or migration.
  @RelationId((role: Role) => role.unit)
  unit_id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'farsi_name', type: 'varchar', length: 255 })
  farsiName!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    name: 'scope_mode',
    type: 'enum',
    enum: RoleScopeMode,
    enumName: 'roles_scope_mode_enum',
    default: RoleScopeMode.DESCENDANTS,
  })
  scopeMode!: RoleScopeMode;
}
