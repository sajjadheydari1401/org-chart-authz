import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessDto {
  @ApiProperty({
    description: 'HTTP method granted by this access.',
    example: 'GET',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  methodName!: string;

  @ApiProperty({
    description: 'Description of the access.',
    example: 'Read organization units.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Local ID of the resource this access belongs to.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  resourceId!: string;
}
