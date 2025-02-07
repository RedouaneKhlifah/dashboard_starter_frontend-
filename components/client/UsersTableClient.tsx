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
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import http from "@/lib/http";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<IClient | null>(null);

  const handleEdit = useCallback(
    (userId: number) => {
      const selectedRecord = users.find((user) => user.id === userId);
      setSelectedRecord(selectedRecord);
      openModal("update");
    },
    [openModal, users]
  );

  const openDeleteModal = useCallback((partenaireId: number) => {
    const clientToDelete = users.find((client) => client.id === partenaireId);
    if (clientToDelete) {
      setClientToDelete(clientToDelete);
      setIsDeleteModalOpen(true);
    }
  }, [users]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
    setIsDeleting(false);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      setIsDeleting(true);

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients/${clientToDelete.id}`,
        {
          method: "DELETE",
          lang,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return;
      }


    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      closeDeleteModal();
    }
  };

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
                onDelete={openDeleteModal}
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
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        itemName={clientToDelete?.first_name || ''}
        isLoading={isDeleting}
        translation={translation}
      />
    </>
  );
}
