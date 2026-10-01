import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
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
    description: 'Parent unit UUID. Omit to create a root unit.',
    example: '8d73c1e7-7f2a-4a6f-bf1f-9bb77cf21734',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
