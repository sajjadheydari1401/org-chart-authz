import { ItEmployees } from "@/data/users";
import { EngineeringTable } from "../engineering-tab-table";

const employees = ItEmployees.filter((employee) => employee.teamId === 2);

export function FrontendTabContent() {
  return <EngineeringTable employees={employees} />;
}
