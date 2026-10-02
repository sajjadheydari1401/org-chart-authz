import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UnitType } from '../../../../types/unit.js';

@Entity({ name: 'units' })
@Index('IDX_units_parent_id', ['parent'])
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Unit, (unit) => unit.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: Unit | null;

  @OneToMany(() => Unit, (unit) => unit.parent)
  children!: Unit[];

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: UnitType,
    enumName: 'units_type_enum',
  })
  type!: UnitType;
}
