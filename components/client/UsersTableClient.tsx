"use client";
import { useCallback } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";

interface UserRow {
    id: number;
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
}

interface UsersTableClientProps {
    users: UserRow[];
    translation: {
        headers: {
            name: string;
            email: string;
            phone: string;
            country: string;
            city: string;
            actions: string;
        };
        actions: {
            edit: string;
            delete: string;
        };
    };
}

export function UsersTableClient({ users, translation }: UsersTableClientProps) {
    const handleEdit = useCallback((userId: number) => {
        console.log("Edit user:", userId);
    }, []);

    const handleDelete = useCallback((userId: number) => {
        console.log("Delete user:", userId);
    }, []);

    return (
        <GlobalTable<UserRow>
            headers={[
                { key: "name", label: translation.headers.name },
                { key: "email", label: translation.headers.email },
                { key: "phone", label: translation.headers.phone },
                { key: "country", label: translation.headers.country },
                { key: "city", label: translation.headers.city },
                {
                    key: "id",
                    label: translation.headers.actions,
                    renderCell: (_, row) => (
                        <ActionButtons
                            Id={row.id}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            editText={translation.actions.edit}
                            deleteText={translation.actions.delete}
                        />
                    ),
                },
            ]}
            rows={users}
            className="shadow-lg rounded-lg overflow-hidden"
        />
    );
}

