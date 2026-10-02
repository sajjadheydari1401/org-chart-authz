import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    description: "Filter users to one unit within the caller's scope.",
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  unitId?: string;
}
