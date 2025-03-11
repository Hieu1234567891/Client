import {
  UpdateUserDto,
  usersControllerMe,
  UsersControllerMeResponse,
  usersControllerUpdateMe,
  UsersControllerUpdateMeData,
  UsersControllerUpdateResponse,
} from "@/client";

const useUpdateProfile = () => {
  const updateProfile = async (
    userDto: UpdateUserDto,
  ): Promise<UsersControllerUpdateResponse> => {
    const request: UsersControllerUpdateMeData = { requestBody: userDto };
    const response: UsersControllerUpdateResponse =
      await usersControllerUpdateMe(request);
    return response;
  };

  const fetchUserData = async (): Promise<UsersControllerMeResponse> => {
    const response: UsersControllerMeResponse = await usersControllerMe();
    return response;
  };
  return { UpdateProfile: updateProfile, fetchUserData };
};

export default useUpdateProfile;
