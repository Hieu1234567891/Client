// components/LoginModal.jsx
import { AuthControllerSignInResponse, SignInResponseDto } from "@/client";
import { useAuth } from "@/hooks/index.ts";
import useLoginModalStore from "@/store/useLoginModalStore.ts";
import useRegisterModalStore from "@/store/useRegisterModalStore.ts";
import { UserStoreInfor } from "@/store/userStore.ts";
import { IconFridge } from "@tabler/icons-react";
import { useState } from "react";

const LoginModal: React.FC = () => {
  const { isOpen, closeSignInModal } = useLoginModalStore();
  const { handleLogin } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { openSignUpModal } = useRegisterModalStore();

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeSignInModal();
    }
  };

  const Login = async () => {
    try {
      const responseData: AuthControllerSignInResponse = await handleLogin(
        usernameOrEmail,
        password,
      );
      if (responseData && responseData.data) {
        const signInResponseDto: SignInResponseDto = responseData.data;
        localStorage.setItem("access_token", signInResponseDto.access_token);
        localStorage.setItem("refresh_token", signInResponseDto.refresh_token);
        await UserStoreInfor();
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl font-semibold mb-4 text-center">Đăng nhập</h1>
        <div className="text-xl mb-4 text-center flex justify-center items-center space-x-2">
          <span>Cơm ngon mỗi ngày</span>
          <IconFridge />
        </div>

        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Tên đăng nhập"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            value={password}
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="flex justify-between mt-4">
          <button className="btn btn-info w-full mr-2" onClick={Login}>
            Đăng nhập
          </button>
        </div>
        <div className="divider mt-4">Hoặc</div>
        <div className="text-center mt-4">
          <span className="mr-2">Chưa có tài khoản?</span>
          <button
            className="btn btn-link"
            onClick={() => {
              closeSignInModal();
              openSignUpModal();
            }}
          >
            Đăng ký tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
