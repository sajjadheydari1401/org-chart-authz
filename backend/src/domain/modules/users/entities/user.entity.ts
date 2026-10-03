import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../authorization/roles/entities/role.entity.js';

@Entity({ name: 'users' })
@Index('UQ_users_username', ['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 40 })
  username!: string;

  @Column({ type: 'varchar', length: 254, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true })
  mobile!: string | null;

  @Column({ name: 'is_manager', type: 'boolean', default: false })
  isManager!: boolean;

  // Provider login uses one role; local RBAC assignments remain separate.
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'provider_login_role_id' })
  providerLoginRole!: Role | null;
}
