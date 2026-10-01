import { IsEnum, IsInt, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleScopeMode } from '../entities/role.entity.js';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Updated role name.',
    example: 'Organization Manager',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    description: 'Updated description of the role.',
    example: 'Manages an organizational unit.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Local ID of the unit this role belongs to.',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  unitId!: number;

  @ApiProperty({
    description:
      'Whether the role applies to its unit only or its descendants.',
    enum: RoleScopeMode,
    example: RoleScopeMode.DESCENDANTS,
  })
  @IsEnum(RoleScopeMode)
  scopeMode!: RoleScopeMode;
}
