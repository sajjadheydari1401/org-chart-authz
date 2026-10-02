import { SetMetadata } from '@nestjs/common';
import type { AccessRequirement } from '../../types/effective-access.js';

export const REQUIRED_ACCESS_METADATA = 'required-access';

// Declare the exact resource route and HTTP method required by a handler.
export const RequireAccess = (access: AccessRequirement) =>
  SetMetadata(REQUIRED_ACCESS_METADATA, access);
