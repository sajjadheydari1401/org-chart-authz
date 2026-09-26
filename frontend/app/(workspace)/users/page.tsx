import { UsersTabs } from "@/components/users/users-tabs";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          کاربران
        </h1>
      </header>
      <UsersTabs />
    </div>
  );
}
