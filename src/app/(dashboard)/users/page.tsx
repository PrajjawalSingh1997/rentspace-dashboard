import { UsersClient } from "@/features/users/components/users-client";

export const metadata = {
    title: "User Management | RentSpace Admin",
    description: "Manage roles, permissions, and user accounts across the platform.",
};

export default function UsersPage() {
    return <UsersClient />;
}
