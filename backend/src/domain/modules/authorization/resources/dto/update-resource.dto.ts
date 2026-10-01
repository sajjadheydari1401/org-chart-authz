import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResourceDto {
  @ApiProperty({
    description: 'Updated route path for the resource.',
    example: '/route/v2',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  route!: string;
}
