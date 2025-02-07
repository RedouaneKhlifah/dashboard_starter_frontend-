"use client";
import { useCallback, useMemo, useState } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import useModalStore from "@/store/modalStore";
import UpdatePartenaireForm from "./UpdatePartenaireForm";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IPartenaire } from "@/interfaces/IPartenaire";
import partenaireMappers, { PartenairRow } from "@/mappers/PartenaireMapper";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import http from "@/lib/http";


interface UsersTablePartenaireProps {
  partenaires: IPartenaire[];
  translation: DictionaryType;
  lang: Locale;
}

export function UsersTablePartenaire({
  partenaires,
  translation,
  lang,
}: UsersTablePartenaireProps) {
  const { openModal } = useModalStore();
  const {
    sidebar: { partenaires_table },
  } = translation;
  const { rowMapper } = partenaireMappers;
  const partenairRows = useMemo(() => rowMapper(partenaires || []), [rowMapper, partenaires]);
  
  const [selectedRecord, setSelectedRecord] = useState<IPartenaire | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [partenaireToDelete, setPartenaireToDelete] = useState<IPartenaire | null>(null);

  const handleEdit = useCallback(
    (partenaireId: number) => {
      const selectedRecord = partenaires.find((partenaire) => partenaire.id === partenaireId);
      setSelectedRecord(selectedRecord);
      openModal("update");
    },
    [openModal, partenaires]
  );

  const openDeleteModal = useCallback((partenaireId: number) => {
    const partenaireToDelete = partenaires.find((partenaire) => partenaire.id === partenaireId);
    if (partenaireToDelete) {
      setPartenaireToDelete(partenaireToDelete);
      setIsDeleteModalOpen(true);
    }
  }, [partenaires]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setPartenaireToDelete(null);
    setIsDeleting(false);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!partenaireToDelete) return;

    try {
      setIsDeleting(true);
      
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires/${partenaireToDelete.id}`,
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
      console.error('Error deleting partenaire:', error);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <>
      <GlobalTable<PartenairRow>
        headers={[
          { key: "number", label: partenaires_table.headers.number },
          { key: "name", label: partenaires_table.headers.name },
          { key: "matricule", label: partenaires_table.headers.matricule },
          {
            key: "id",
            label: partenaires_table.headers.actions,
            renderCell: (_, row) => (
              <ActionButtons
                Id={row.id}
                onEdit={handleEdit}
                onDelete={openDeleteModal}
                editText={partenaires_table.actions.edit}
                deleteText={partenaires_table.actions.delete}
              />
            ),
          },
        ]}
        rows={partenairRows}
        className="shadow-lg rounded-lg overflow-hidden"
      />

      <UpdatePartenaireForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        itemName={partenaireToDelete?.name || ''}
        isLoading={isDeleting}
        translation={translation}
      />
    </>
  );
}