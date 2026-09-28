import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'resources' })
export class Resource {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  route!: string;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;
}
