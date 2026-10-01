import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Route path represented by this resource.',
    example: '/route/v2',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  route!: string;
}
