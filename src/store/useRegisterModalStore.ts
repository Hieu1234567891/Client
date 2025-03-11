// stores/useRegisterModalStore.ts
import create from "zustand";

interface RegisterModalStore {
  isOpen: boolean;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
}

const useRegisterModalStore = create<RegisterModalStore>((set) => ({
  isOpen: false,
  openSignUpModal: () => set({ isOpen: true }),
  closeSignUpModal: () => set({ isOpen: false }),
}));

export default useRegisterModalStore;
