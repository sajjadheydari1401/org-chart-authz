import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterWithUsernamePasswordDto {
  @ApiProperty({
    description: 'Email address for the new account.',
    example: 'person@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'English name of the role requested for the new account.',
    example: 'member',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 100)
  role: string;

  @ApiProperty({
    description: 'Account username. Must be 2 to 40 characters.',
    example: 'sajjad',
  })
  @IsString()
  @Length(2, 40)
  username: string;

  @ApiProperty({
    description: 'Account password. Must contain at least 8 characters.',
    example: 'strong-password',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Iranian mobile number used for SMS verification.',
    example: '09123456789',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .trim()
          .replace(/[\u06f0-\u06f9\u0660-\u0669]/g, (digit) =>
            String(
              digit.charCodeAt(0) -
                (digit.charCodeAt(0) >= 0x6f0 ? 0x6f0 : 0x660),
            ),
          )
      : value,
  )
  @Matches(/^09\d{9}$/)
  mobile: string;

  @ApiPropertyOptional({
    description: 'Whether the new user is a manager. Defaults to false.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isManager?: boolean;
}
