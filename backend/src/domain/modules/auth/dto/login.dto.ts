import { IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(2, 40)
  username: string;

  @IsString()
  @MinLength(1)
  password: string;
}
