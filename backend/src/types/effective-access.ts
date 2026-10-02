export interface AccessRequirement {
  route: string;
  methodName: string;
}

export interface EffectiveAccess extends AccessRequirement {
  unitIds: string[];
}
