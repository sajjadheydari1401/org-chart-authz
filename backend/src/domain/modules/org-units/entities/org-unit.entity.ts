import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'units' })
@Index('IDX_units_parent_id', ['parentId'])
export class OrgUnit {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ name: 'parent_id', type: 'integer', nullable: true })
  parentId!: number | null;

  // Root units have no parent; a parent cannot be deleted while it has child units.
  @ManyToOne(() => OrgUnit, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: OrgUnit | null;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;
}
