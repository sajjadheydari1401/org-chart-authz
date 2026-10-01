import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity.js';
import { Role } from '../../roles/entities/role.entity.js';

@Entity({ name: 'role_assignments' })
@Index('UQ_role_assignments_user_id_role_id', ['user', 'role'], {
  unique: true,
})
@Index('IDX_role_assignments_role_id', ['role'])
export class RoleAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
