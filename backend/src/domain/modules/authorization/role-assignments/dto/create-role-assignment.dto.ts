import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleAssignmentDto {
  @ApiProperty({
    description: 'Local user UUID receiving the role.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'Local role UUID to assign.',
    example: '8d73c1e7-7f2a-4a6f-bf1f-9bb77cf21734',
    format: 'uuid',
  })
  @IsUUID()
  roleId!: string;
}
