import React from "react";
import GlobalModal from "./GlobalModal";
import { DictionaryType } from "@/lib/i18n";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";

interface ConfirmationModalProps {
  onConfirm: () => Promise<void>;
  itemName: string;
  translation: DictionaryType;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  itemName,
  translation,
}) => {
  const { closeModal, modalType } = useModalStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <GlobalModal
      open={modalType === ModalTypeEnum.DELETE}
      onClose={closeModal}
      title={
        translation.sidebar.partenaires_table.delete_confirmation.modal_title
      }
      onSubmit={handleSubmit}
      submitButtonText={translation.client.common.delete}
      cancelButtonText={translation.client.common.cancel}
    >
      <div className="flex flex-col gap-4">
        <p className="text-foreground">
          {translation.sidebar.partenaires_table.delete_confirmation.title}
          <span className="font-semibold mx-1">{itemName}</span>?
        </p>
        <p className="text-sm text-muted-foreground">
          {translation.sidebar.partenaires_table.delete_confirmation.warning}
        </p>
      </div>
    </GlobalModal>
  );
};
