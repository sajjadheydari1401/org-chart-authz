import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'units' })
export class Unit {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @ManyToOne(() => Unit, (unit) => unit.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: Unit | null;

  @OneToMany(() => Unit, (unit) => unit.parent)
  children!: Unit[];

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: string;
}
