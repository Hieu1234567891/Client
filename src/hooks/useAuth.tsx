import {
  authControllerRefresh,
  AuthControllerRefreshData,
  AuthControllerRefreshResponse,
  authControllerSignIn,
  AuthControllerSignInResponse,
  authControllerSignUp,
  AuthControllerSignUpResponse,
  SignInRequest,
  SignUpRequest,
  usersControllerUpdate,
  authControllerLogout, AuthControllerLogoutData
} from "@/client";

const useAuth = () => {
  const createAccount = async (
    usernameOrEmail: string,
    password: string,
    fullName?: string,
    avatar?: string,
    bio?: string,
  ): Promise<AuthControllerSignUpResponse> => {
    const signUpRequest: SignUpRequest = {
      usernameOrEmail,
      password,
      full_name: fullName,
      avatar,
      bio,
    };
    const response: AuthControllerSignUpResponse = await authControllerSignUp({
      requestBody: signUpRequest,
    });
    return response;
  };

  const handleLogin = async (
    usernameOrEmail: string,
    password: string,
  ): Promise<AuthControllerSignInResponse> => {
    const signInRequest: SignInRequest = { usernameOrEmail, password };
    const response: AuthControllerSignInResponse = await authControllerSignIn({
      requestBody: signInRequest,
    });
    return response;
  };
  const signOut = async (data: AuthControllerLogoutData) => {
    try {
      const response = await authControllerLogout(data);
      return response;
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  };

  const refreshToken = async (
    access_token: string,
    refresh_token: string,
  ): Promise<AuthControllerRefreshResponse> => {
    const refreshTokenRequest: AuthControllerRefreshData = {
      requestBody: { access_token, refresh_token },
    };
    const response: AuthControllerRefreshResponse =
      await authControllerRefresh(refreshTokenRequest);
    return response;
  };
  const changePassword = async (
    userId: string,
    password: string,
  ): Promise<void> => {
    try {
      await usersControllerUpdate({
        id: userId,
        requestBody: { password: password },
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  return {
    createAccount,
    handleLogin,
    refreshToken,
    changePassword,
    signOut,
  };
};

export default useAuth;
