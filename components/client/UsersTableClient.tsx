"use client";

import { useCallback, useMemo, useState } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import useModalStore from "@/store/modalStore";
import UpdateClientForm from "./UpdateClientForm";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IClient } from "@/interfaces/IClient";
import clientMappers, { UserRow } from "@/mappers/ClientMapper";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate"; // Import the custom hook

interface UsersTableClientProps {
  users: IClient[];
  translation: DictionaryType;
  lang: Locale;
}

export function UsersTableClient({
  users,
  translation,
  lang,
}: UsersTableClientProps) {
  const { openModal } = useModalStore();
  const {
    sidebar: { users_table },
  } = translation;
  // Mappers
  const { rowMapper } = clientMappers;

  // State for real-time client updates
  const [clients, setClients] = useState<IClient[]>(users);
  const [selectedRecord, setSelectedRecord] = useState<IClient | undefined>(
    undefined
  );
  const userRows = useMemo(
    () => rowMapper(clients || []),
    [rowMapper, clients]
  );

  // Use the custom hook for real-time updates
  const handleClientUpdate = useEntityUpdate<IClient>(setClients);

  // Subscribe to Pusher events for "client" model updates.
  usePusher("client", handleClientUpdate);

  // Handlers for edit and delete actions.
  const handleEdit = useCallback(
    (userId: number) => {
      const selectedRecord = clients.find((user) => user.id === userId);
      setSelectedRecord(selectedRecord);
      openModal("update");
    },
    [openModal, clients]
  );

  const handleDelete = useCallback((userId: number) => {
    console.log("Delete user:", userId);
    // Add your deletion logic here (for example, call an API endpoint)
  }, []);

  return (
    <>
      <GlobalTable<UserRow>
        headers={[
          { key: "name", label: users_table.headers.name },
          { key: "email", label: users_table.headers.email },
          { key: "phone", label: users_table.headers.phone },
          { key: "country", label: users_table.headers.country },
          { key: "city", label: users_table.headers.city },
          {
            key: "id",
            label: users_table.headers.actions,
            renderCell: (_, row) => (
              <ActionButtons
                Id={row.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
                editText={users_table.actions.edit}
                deleteText={users_table.actions.delete}
              />
            ),
          },
        ]}
        rows={userRows}
        className="shadow-lg rounded-lg overflow-hidden"
      />
      <UpdateClientForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />
    </>
  );
}
