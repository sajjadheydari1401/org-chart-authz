export interface IManager {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  department: {
    id: number;
    name: string;
  };
}

export interface IEmployee {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  teamId: number;
}
