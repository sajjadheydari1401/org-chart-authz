import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ description: 'Unit name.', example: 'Finance' })
  @IsString()
  @Length(1, 255)
  name!: string;

  @ApiProperty({ description: 'Unit type.', example: 'department' })
  @IsString()
  @Length(1, 50)
  type!: string;

  @ApiPropertyOptional({
    description: 'Parent unit ID. Omit to create a root unit.',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number;
}
