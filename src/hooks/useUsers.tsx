import {
  authControllerSignUp,
  SignUpRequest,
  UpdateUserDto,
  UserDto,
  usersControllerFindAllByAny,
  UsersControllerFindAllByAnyResponse,
  usersControllerFindById,
  usersControllerFindFollowers,
  UsersControllerFindFollowersData,
  usersControllerFindFollowings,
  UsersControllerFindFollowingsData,
  usersControllerFindMyFollowers,
  UsersControllerFindMyFollowersData,
  usersControllerFindMyFollowings,
  UsersControllerFindMyFollowingsData,
  usersControllerFollow,
  usersControllerIsFollowing,
  usersControllerRemove,
  usersControllerUnfollow,
  usersControllerUpdate,
  UsersControllerUpdateData
} from "@/client";
import { useLoadingBar } from "@/layouts/LoadingBarContext.tsx";
import { useState } from "react";

const UseUser = () => {
  const [users, setUsers] = useState<UserDto[]>();
  const [user, setUser] = useState<UserDto | undefined>(undefined);
  const [totalPage, setTotalPage] = useState<number>(0);
  const { startLoading, completeLoading } = useLoadingBar();
  const createUser = async (userDto: SignUpRequest) => {
    try {
      const response = await authControllerSignUp({ requestBody: userDto });
      console.log(response);
    } catch (e) {
      return "Username or email already exists"; // Trả về thông báo khi có lỗi
    }
  };

  const getAllUsers = async (
    index: number,
    keySearch: string,
  ): Promise<void> => {
    try {
      const response: UsersControllerFindAllByAnyResponse =
        await usersControllerFindAllByAny({
          perPage: 7,
          page: index,
          q: keySearch,
        });
      if (response.data) {
        setUsers(response.data);
        if (response.meta?.total_pages) {
          setTotalPage(response.meta.total_pages);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const getUsersById = async (id: string) => {
    try {
      const response = await usersControllerFindById({ id: id });
      if (response.data) {
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const updateUser = async (
    userId: string,
    updatedData: UpdateUserDto,
  ): Promise<void> => {
    startLoading();
    try {
      const response = await usersControllerUpdate({
        id: userId,
        requestBody: updatedData,
      });
      if (response.data) {
        setUser(response.data);
      }
      completeLoading();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const updateUser2_0 = async (data: UsersControllerUpdateData) => {
    startLoading();
    try {
      const response = await usersControllerUpdate(data);
      if (response.data) {
        setUser(response.data);
      }
      completeLoading();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      const response = await usersControllerRemove({ id });
      console.log("User removed successfully:", response);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };
  const followUser = async (id: string) => {
    try {
      const response = await usersControllerFollow({
        id: id,
      });
      console.log("User removed successfully:", response);
    } catch (error) {
      console.error("Error updating user:", error);
      return 401;
    }
  };

  const unFollowUser = async (id: string) => {
    try {
      const response = await usersControllerUnfollow({
        id: id,
      });
      console.log(response)
    } catch (error) {
      console.error("Error updating user:", error);
      return 401;
    }
  };
  const isFollowing = async (id: string) => {
    try {
      const response = await usersControllerIsFollowing({
        id: id,
      });
      if (response.data) {
        return true;
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const fetchFollowingById = async (
    data: UsersControllerFindFollowingsData,
  ) => {
    try {
      const response = await usersControllerFindFollowings(data);
      if (response.data) {
        const totalPages = response.meta?.total_pages ?? 0;
        setTotalPage(totalPages);
        return response.data;
      }
    } catch (error) {
      return false;
    }
  };

  const fetchFollowerById = async (data: UsersControllerFindFollowersData) => {
    try {
      const response = await usersControllerFindFollowers(data);
      if (response.data) {
        const totalPages = response.meta?.total_pages ?? 0;
        setTotalPage(totalPages);
        return response.data;
      }
    } catch (error) {
      return false;
    }
  };

  const fetchFollowerByMe = async (
    data: UsersControllerFindMyFollowersData,
  ) => {
    try {
      const response = await usersControllerFindMyFollowers(data);
      if (response.data) {
        setTotalPage(response.meta?.total_pages || 0);
        return response.data;
      }
    } catch (error) {
      return false;
    }
  };

  const fetchFollowingByMe = async (
    data: UsersControllerFindMyFollowingsData,
  ) => {
    try {
      const response = await usersControllerFindMyFollowings(data);
      if (response.data) {
        const totalPages = response.meta?.total_pages ?? 0;
        setTotalPage(totalPages);
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchFollowingByMe,
    fetchFollowerByMe,
    fetchFollowerById,
    fetchFollowingById,
    updateUser2_0,
    totalPage,
    users,
    user,
    getAllUsers,
    updateUser,
    deleteUser,
    createUser,
    getUsersById,
    followUser,
    unFollowUser,
    isFollowing,
  };
};

export default UseUser;
