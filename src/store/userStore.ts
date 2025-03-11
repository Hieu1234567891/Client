import { UserDto, usersControllerMe } from "@/client";
import create from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  name: string;
  username: string;
  id: string;
  avatar: string;
  bio: string;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      username: "",
      id: "",
      avatar: "",
      bio: "",
      setUser: (user) => set((state) => ({ ...state, ...user })),
      clearUser: () =>
        set({
          name: "",
          username: "",
          id: "",
          avatar: "",
          bio: "",
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        username: state.username,
        id: state.id,
        avatar: state.avatar,
        bio: state.bio,
      }),
    },
  ),
);

export const UserStoreInfor = async () => {
  const response = await usersControllerMe();
  const user = response.data as UserDto | undefined;
  if (user) {
    useUserStore.getState().setUser({
      name: user.full_name || "",
      id: user.id || "",
      username: user.usernameOrEmail || "",
      avatar: user.avatar || "",
      bio: user.bio || "",
    });
  }
};

export const clearUserInfo = () => {
  useUserStore.getState().clearUser();
};

export default useUserStore;
