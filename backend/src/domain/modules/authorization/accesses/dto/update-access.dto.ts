import { OmitType } from '@nestjs/swagger';
import { CreateAccessDto } from './create-access.dto.js';

export class UpdateAccessDto extends OmitType(CreateAccessDto, [
  'resourceId',
] as const) {}
