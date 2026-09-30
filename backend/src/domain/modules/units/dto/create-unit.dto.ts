import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsString()
  @Length(1, 50)
  type!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number;
}
