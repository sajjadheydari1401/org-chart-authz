import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleAssignmentDto {
  @ApiProperty({
    description: 'Local user ID receiving the role.',
    example: 7,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiProperty({
    description: 'Local role ID to assign.',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  roleId!: number;
}
