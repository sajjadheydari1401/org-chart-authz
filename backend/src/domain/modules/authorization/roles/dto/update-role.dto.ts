import { IsEnum, IsString, IsUUID, Length } from 'class-validator';
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
    description:
      'Local Farsi display name for the role; not sent to the provider.',
    example: 'مدیر واحد سازمانی',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  farsiName!: string;

  @ApiProperty({
    description: 'Updated description of the role.',
    example: 'Manages an organizational unit.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Local UUID of the unit this role belongs to.',
    example: '8d73c1e7-7f2a-4a6f-bf1f-9bb77cf21734',
    format: 'uuid',
  })
  @IsUUID()
  unitId!: string;

  @ApiProperty({
    description:
      'Whether the role applies to its unit only or its descendants.',
    enum: RoleScopeMode,
    example: RoleScopeMode.DESCENDANTS,
  })
  @IsEnum(RoleScopeMode)
  scopeMode!: RoleScopeMode;
}
