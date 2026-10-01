import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleAccessDto {
  @ApiProperty({ description: 'Local role ID.', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  roleId!: number;

  @ApiProperty({
    description: 'Local access ID to link to the role.',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  accessId!: number;
}
