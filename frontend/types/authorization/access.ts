export interface EffectiveAccess {
  route: string;
  methodName: string;
  unitIds: string[];
}

export interface AccessRequirement {
  route: string;
  methodName: string;
}
