import type { IOrgUnit } from "@/types/org-unit";

export function getDepartments(units: readonly IOrgUnit[]) {
  return units.filter((unit) => unit.type === "department");
}

export function getTeams(units: readonly IOrgUnit[]) {
  return units.filter((unit) => unit.type === "team");
}
