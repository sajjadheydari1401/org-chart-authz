import { ItEmployees } from "@/data/users";
import { EngineeringTable } from "../engineering-tab-table";

const employees = ItEmployees.filter((employee) => employee.teamId === 1);

export function BackendTabContent() {
  return <EngineeringTable employees={employees} />;
}
