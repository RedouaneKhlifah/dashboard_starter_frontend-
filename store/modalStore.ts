// store/modalStore.ts

import { create } from "zustand";

// Enum for modal types
export enum ModalTypeEnum {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  UPLOAD = "upload",
  History = "history",
}

// Modal store state interface
interface ModalState {
  modalType: ModalTypeEnum | null;
  secondModalType: ModalTypeEnum | null;
  isOpen: boolean;
  isSecondOpen: boolean;
  isLoading: boolean;

  // Modal control functions
  openModal: (type: ModalTypeEnum) => void;
  openSecondModal: (type: ModalTypeEnum) => void;
  closeModal: () => void;
  closeSecondModal: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

// Zustand store
const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  secondModalType: null,
  isOpen: false,
  isSecondOpen: false,
  isLoading: false,

  openModal: (type) => set({ modalType: type, isOpen: true }),
  openSecondModal: (type) => set({ secondModalType: type, isSecondOpen: true }),

  closeModal: () => set({ modalType: null, isOpen: false }),
  closeSecondModal: () => set({ secondModalType: null, isSecondOpen: false }),

  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useModalStore;
