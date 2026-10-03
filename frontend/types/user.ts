export interface UserDirectoryRecord {
  id: string;
  username: string;
  email: string | null;
  mobile: string | null;
  isManager: boolean;
}
