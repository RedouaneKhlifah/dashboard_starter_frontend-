// store/modalStore.ts
import { create } from "zustand";

export enum ModalTypeEnum {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

interface ModalState {
  modalType: ModalTypeEnum | null;
  isOpen: boolean;
  openModal: (type: ModalTypeEnum) => void;
  closeModal: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (type: ModalTypeEnum) => set({ modalType: type, isOpen: true }),
  closeModal: () => set({ modalType: null, isOpen: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  isLoading: false,
}));

export default useModalStore;
