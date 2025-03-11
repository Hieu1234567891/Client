import { AuthControllerRefreshResponse, OpenAPI } from "@/client";
import { useAuth } from "@/hooks";
import useLoginModalStore from "@/store/useLoginModalStore.ts";
import { toast } from "react-toastify";

OpenAPI.BASE = process.env.API_URL || "http://localhost:3000";
OpenAPI.interceptors.request.use((request: RequestInit) => {
  const rawToken = localStorage.getItem("access_token");
  const token = rawToken ? `Bearer ${rawToken.replace(/"/g, "")}` : "";
  if (rawToken) {
    if (!request.headers) {
      request.headers = new Headers();
    }

    switch (request.method) {
      case "GET":
        (request.headers as Headers).set("Authorization", token);
        break;
      case "POST":
        (request.headers as Headers).set("Authorization", token);
        break;
      case "PATCH":
        (request.headers as Headers).set("Authorization", token);
        (request.headers as Headers).set("accept", "application/json");
        (request.headers as Headers).set("Content-Type", "application/json");
        break;
    }
  }
  return request;
});

OpenAPI.interceptors.response.use(async (response: Response) => {
  const { refreshToken, signOut } = useAuth();
  const refresh_token = localStorage.getItem("refresh_token")?.replace(/"/g, "") ?? "";
  const access_token = localStorage.getItem("access_token")?.replace(/"/g, "") ?? "";

  const openSignInModal = () => {
    (useLoginModalStore.getState() as { openSignInModal: () => void }).openSignInModal();
  };

  const handleUnauthorizedError = async (responseData: any) => {
    if (
      responseData.statusCode === 401 &&
      responseData.message === "error.auth.invalid_refresh_token" &&
      responseData.error === "Unauthorized"
    ) {
      localStorage.clear();
      signOut({ requestBody: { access_token: access_token, refresh_token: refresh_token } });
      window.location.reload();
      return;
    }
    const refreshResponse: AuthControllerRefreshResponse = await refreshToken(
      access_token,
      refresh_token
    );
    if (refreshResponse.data) {
      localStorage.setItem("access_token", refreshResponse.data.access_token);
      localStorage.setItem("refresh_token", refreshResponse.data.refresh_token);
    }
    return;
  };

  const handleUnauthorizedByNotSignIn = async (responseData: any) => {
    if (
      responseData.statusCode === 401 &&
      responseData.message === "Unauthorized"
    ) {
      toast.error("Hãy đăng nhập để sử dụng tính năng này");
      openSignInModal();
      return;
    }


  };

  switch (response.status) {
    case 401: {
      const responseData = await response.json();

      if (response.url.endsWith("/auth/sign_in")) {
        toast.error("Sai tên đăng nhập hoặc mật khẩu");
      } else if (refresh_token) {
        await handleUnauthorizedError(responseData);
      } else if (responseData.message === "Unauthorized" && !refresh_token) {
        await handleUnauthorizedByNotSignIn(responseData);
      }
      break;
    }
    case 409: {
      const responseData = await response.json();
      toast.error(responseData.message);
      break;
    }
    default:
      break;
  }

  return response;
});
