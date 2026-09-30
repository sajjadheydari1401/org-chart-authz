import { IsInt, Min } from 'class-validator';

export class CreateRoleAccessDto {
  @IsInt()
  @Min(1)
  roleId!: number;

  @IsInt()
  @Min(1)
  accessId!: number;
}
