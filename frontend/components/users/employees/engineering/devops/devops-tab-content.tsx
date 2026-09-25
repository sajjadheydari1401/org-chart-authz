import { ItEmployees } from "@/data/users";
import { EngineeringTable } from "../engineering-tab-table";

const employees = ItEmployees.filter((employee) => employee.teamId === 3);

export function DevopsTabContent() {
  return <EngineeringTable employees={employees} />;
}
