import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleAccessDto {
  @ApiProperty({
    description: 'Local role UUID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  roleId!: string;

  @ApiProperty({
    description: 'Local access UUID to link to the role.',
    example: '8d73c1e7-7f2a-4a6f-bf1f-9bb77cf21734',
    format: 'uuid',
  })
  @IsUUID()
  accessId!: string;
}
