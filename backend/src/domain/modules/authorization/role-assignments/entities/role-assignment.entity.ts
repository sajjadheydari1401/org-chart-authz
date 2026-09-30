import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity.js';
import { Role } from '../../roles/entities/role.entity.js';

@Entity({ name: 'role_assignments' })
export class RoleAssignment {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
