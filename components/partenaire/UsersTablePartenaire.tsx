"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import UpdatePartenaireForm from "./UpdatePartenaireForm";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IPartenaire } from "@/interfaces/IPartenaire";
import partenaireMappers, { PartenairRow } from "@/mappers/PartenaireMapper";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import CreatePartenaireForm from "./CreatePartenaireForm";
import Header from "../shared/Header";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";
import http from "@/lib/http";

interface UsersTablePartenaireProps {
  records: IPartenaire[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function UsersTablePartenaire({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: UsersTablePartenaireProps) {
  const { openModal, modalType, closeModal } = useModalStore();
  const { rowMapper } = partenaireMappers;
  const {
    sidebar: { partenaires_table },
  } = translation;

  // State
  const [partenaires, setPartenaires] = useState<IPartenaire[]>(records);
  const [totalPartenaires, setTotalPartenaires] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IPartenaire | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const didMountRef = useRef(false);

  const partenairRows = useMemo(
    () => rowMapper(partenaires),
    [rowMapper, partenaires]
  );

  const handlePartenaireUpdate = useEntityUpdate<IPartenaire>(setPartenaires);
  usePusher("partenaire", handlePartenaireUpdate);

  const refreshPartenaires = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "partenaires",
    setRecords: setPartenaires,
    setTotalRecords: setTotalPartenaires,
  });

  const debouncedSearch = useDebounce(refreshPartenaires, 300);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  const handleEdit = useCallback(
    (partenaireId: number) => {
      const record = partenaires.find((p) => p.id === partenaireId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, partenaires]
  );

  const openDeleteModal = useCallback(
    (partenaireId: number) => {
      const record = partenaires.find((p) => p.id === partenaireId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [partenaires, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;

      closeModal();
      refreshPartenaires(true);
    } catch (error) {
      console.error("Error deleting partenaire:", error);
    }
  };

  return (
    <>
      <Header
        title={partenaires_table.partner_management}
        searchPlaceholder={partenaires_table.search_placeholder}
        buttonText={partenaires_table.create_new_partner}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />

      <GlobalTable<PartenairRow>
        headers={[
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
        totalRows={totalPartenaires}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-hidden"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      <UpdatePartenaireForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />

      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.name || ""}
        translation={translation}
      />

      <CreatePartenaireForm lang={lang} translation={translation} />
    </>
  );
}
