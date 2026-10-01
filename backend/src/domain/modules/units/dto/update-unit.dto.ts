import { IsString, IsUUID, Length, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUnitDto {
  // Skip validation when this PATCH field is omitted.
  @ApiPropertyOptional({
    description: 'New unit name.',
    example: 'Finance',
    minLength: 1,
    maxLength: 255,
  })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 255)
  name?: string;

  // Skip validation when this PATCH field is omitted.
  @ApiPropertyOptional({
    description: 'New unit type.',
    example: 'department',
    minLength: 1,
    maxLength: 50,
  })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 50)
  type?: string;

  // Omitted leaves the parent unchanged; null explicitly clears it.
  @ApiPropertyOptional({
    description:
      'New parent unit UUID. Send null to move the unit to the root.',
    example: '8d73c1e7-7f2a-4a6f-bf1f-9bb77cf21734',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @IsUUID()
  parentId?: string | null;
}
