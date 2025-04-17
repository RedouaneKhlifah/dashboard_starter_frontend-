import React from "react";
import GlobalModal from "./GlobalModal";
import { DictionaryType } from "@/lib/i18n";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";

interface OptimiseConfirmationModalProps {
  onConfirm: () => Promise<void>;
  itemName: string;
  translation: DictionaryType;
  isLoading?: boolean;
  backdrop?: boolean;
  dismiss?: boolean;
}

export const OptimiseConfirmationModal: React.FC<
  OptimiseConfirmationModalProps
> = ({ onConfirm, itemName, translation, isLoading }) => {
  const { secondModalType, closeSecondModal } = useModalStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <GlobalModal
      open={secondModalType === ModalTypeEnum.DELETE}
      onClose={closeSecondModal}
      title={
        translation.sidebar.partenaires_table.delete_confirmation.modal_title
      }
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitButtonText={translation.client.common.delete}
      cancelButtonText={translation.client.common.cancel}
      contentClassName="2xl:min-w-[30%] 2xl:max-w-[30%] lg:min-w-[40%] lg:max-w-[40%] "
      backdrop={false}
      dismiss={false}
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
