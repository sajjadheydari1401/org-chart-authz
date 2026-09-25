import { UsersTabs } from "@/components/users/users-tabs";

// Temporary preview until the Users page is implemented.
export default function UsersPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Users</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Temporary tabs preview with sample content.
        </p>
      </header>
      <UsersTabs />
    </div>
  );
}
