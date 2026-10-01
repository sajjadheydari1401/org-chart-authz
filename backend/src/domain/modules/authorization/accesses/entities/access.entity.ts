import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity.js';

@Entity({ name: 'accesses' })
@Index('UQ_accesses_resource_id_method_name', ['resource', 'methodName'], {
  unique: true,
})
export class Access {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;

  @ManyToOne(() => Resource, { nullable: false })
  @JoinColumn({ name: 'resource_id' })
  resource!: Resource;

  @Column({ name: 'method_name', type: 'varchar', length: 50 })
  methodName!: string;

  @Column({ type: 'text' })
  description!: string;
}
