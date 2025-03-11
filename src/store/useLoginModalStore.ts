// stores/useLoginModalStore.ts
import create from "zustand";

interface LoginModalStore {
  isOpen: boolean;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

const useLoginModalStore = create<LoginModalStore>((set) => ({
  isOpen: false,
  openSignInModal: () => set({ isOpen: true }),
  closeSignInModal: () => set({ isOpen: false }),
}));

export default useLoginModalStore;
