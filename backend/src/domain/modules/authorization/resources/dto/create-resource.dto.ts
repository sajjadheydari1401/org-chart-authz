import { IsString, Length } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @Length(1, 255)
  route!: string;
}
