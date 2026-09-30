import { IsInt, IsString, Length, Min, ValidateIf } from 'class-validator';

export class UpdateUnitDto {
  // Skip validation when this PATCH field is omitted.
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 255)
  name?: string;

  // Skip validation when this PATCH field is omitted.
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 50)
  type?: string;

  // Omitted leaves the parent unchanged; null explicitly clears it.
  @ValidateIf((_object, value) => value !== undefined && value !== null)
  @IsInt()
  @Min(1)
  parentId?: number | null;
}
