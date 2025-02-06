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

  const { rowMapper } = clientMappers;
  const userRows = useMemo(() => rowMapper(users || []), [rowMapper, users]);
  const [selectedRecord, setSelectedRecord] = useState<IClient | undefined>(
    undefined
  );

  const handleEdit = useCallback(
    (userId: number) => {
      const selectedRecord = users.find((user) => user.id === userId);
      setSelectedRecord(selectedRecord);
      openModal("update");
    },
    [openModal, users]
  );

  const handleDelete = useCallback((userId: number) => {
    console.log("Delete user:", userId);
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
