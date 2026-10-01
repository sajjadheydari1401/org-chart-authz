import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Access } from '../../accesses/entities/access.entity.js';
import { Role } from '../../roles/entities/role.entity.js';

@Entity({ name: 'role_accesses' })
@Index('IDX_role_accesses_access_id', ['accessId'])
export class RoleAccess {
  @PrimaryColumn({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @PrimaryColumn({ name: 'access_id', type: 'uuid' })
  accessId!: string;

  @ManyToOne(() => Access, { nullable: false })
  @JoinColumn({ name: 'access_id' })
  access!: Access;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  providerId!: string;
}
