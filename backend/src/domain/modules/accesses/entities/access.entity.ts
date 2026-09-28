import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Resource } from './resource.entity.js';

@Entity({ name: 'accesses' })
export class Access {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @ManyToOne(() => Resource, { nullable: false })
  @JoinColumn({ name: 'resource_id' })
  resource!: Resource;

  @Column({ name: 'method_name', type: 'varchar', length: 50 })
  methodName!: string;

  @Column({ type: 'text' })
  description!: string;
}
