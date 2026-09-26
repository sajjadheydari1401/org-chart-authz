import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 40)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

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
}
