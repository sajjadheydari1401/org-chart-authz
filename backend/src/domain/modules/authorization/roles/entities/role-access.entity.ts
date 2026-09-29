import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Access } from '../../accesses/entities/access.entity.js';
import { Role } from './role.entity.js';

@Entity({ name: 'role_accesses' })
export class RoleAccess {
  @PrimaryColumn({ name: 'role_id', type: 'integer' })
  roleId!: number;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @PrimaryColumn({ name: 'access_id', type: 'integer' })
  accessId!: number;

  @ManyToOne(() => Access, { nullable: false })
  @JoinColumn({ name: 'access_id' })
  access!: Access;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;
}
