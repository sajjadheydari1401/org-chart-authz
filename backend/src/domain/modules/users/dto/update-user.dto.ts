import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'New username for the user.',
    example: 'sajjad',
    minLength: 2,
    maxLength: 40,
  })
  @IsString()
  @Length(2, 40)
  username!: string;
}
