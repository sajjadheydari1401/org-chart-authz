import { IsString, Length, MaxLength, MinLength } from 'class-validator';

export class ConfirmSMSDto {
  @IsString()
  @Length(2, 40)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
