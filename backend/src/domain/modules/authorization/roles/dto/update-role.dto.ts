import { IsEnum, IsInt, IsString, Length, Min } from 'class-validator';
import { RoleScopeMode } from '../entities/role.entity.js';

export class UpdateRoleDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  description!: string;

  @IsInt()
  @Min(1)
  unitId!: number;

  @IsEnum(RoleScopeMode)
  scopeMode!: RoleScopeMode;
}
