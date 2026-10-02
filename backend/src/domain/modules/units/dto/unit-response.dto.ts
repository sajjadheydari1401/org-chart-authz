import { ApiProperty } from '@nestjs/swagger';
import { UnitType } from '../../../../types/unit.js';

export class UnitResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UnitType })
  type!: UnitType;

  @ApiProperty({ format: 'uuid', nullable: true })
  parentId!: string | null;
}
