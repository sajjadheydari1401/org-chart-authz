export interface AccessRequirement {
  route: string;
  methodName: string;
  allowOwner?: boolean;
}

export interface EffectiveAccess extends AccessRequirement {
  // Which units allow this route/method. For owner access, we use ['owner'] as a marker.
  unitIds: string[];
}
