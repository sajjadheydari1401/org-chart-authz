import { IsString, Length, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmRegistrationBySmsDto {
  @ApiProperty({
    description: 'Username used during registration.',
    example: 'sajjad',
  })
  @IsString()
  @Length(2, 40)
  username: string;

  @ApiProperty({
    description: 'Six-digit code sent to the registered mobile number.',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
