import { IsInt, IsString, Length, Min, ValidateIf } from 'class-validator';
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
    description: 'New parent unit ID. Send null to move the unit to the root.',
    example: 3,
    minimum: 1,
    nullable: true,
    type: Number,
  })
  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @IsInt()
  @Min(1)
  parentId?: number | null;
}
