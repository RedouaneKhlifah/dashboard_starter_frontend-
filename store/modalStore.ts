// store/modalStore.ts
import { create } from "zustand";

interface ModalState {
  modalType: "create" | "update" | null;
  isOpen: boolean;
  openModal: (type: "create" | "update") => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (type: "create" | "update") =>
    set({ modalType: type, isOpen: true }),
  closeModal: () => set({ modalType: null, isOpen: false }),
}));

export default useModalStore;
