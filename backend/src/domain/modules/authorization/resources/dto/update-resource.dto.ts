import { IsString, Length } from 'class-validator';

export class UpdateResourceDto {
  @IsString()
  @Length(1, 255)
  route!: string;
}
