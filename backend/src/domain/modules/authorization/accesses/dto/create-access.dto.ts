import { IsInt, IsString, Length, Min } from 'class-validator';
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
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  resourceId!: number;
}
