import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateAccessDto {
  @IsString()
  @Length(1, 50)
  methodName!: string;

  @IsString()
  description!: string;

  @IsInt()
  @Min(1)
  resourceId!: number;
}
