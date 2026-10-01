import { IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithUsernamePasswordDto {
  @ApiProperty({
    description: 'Registered account username.',
    example: 'sajjad',
  })
  @IsString()
  @Length(2, 40)
  username: string;

  @ApiProperty({ description: 'Account password.', example: 'strong-password' })
  @IsString()
  @MinLength(1)
  password: string;
}
