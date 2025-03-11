import { AuthControllerSignUpResponse, SignInResponseDto } from "@/client";
import { useAuth } from "@/hooks";
import useRegisterModalStore from "@/store/useRegisterModalStore.ts";
import { UserStoreInfor } from "@/store/userStore.ts";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";

const RegisterModal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar] = useState(
    "https://static.naucomnha.com/images/7792ba4e-e8fd-45f5-9077-80039fcf8044.jfif",
  );
  const [bio, setBio] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { createAccount } = useAuth();
  const { isOpen, closeSignUpModal } = useRegisterModalStore();

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeSignUpModal();
    }
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      if (password !== confirmPassword) {
        toast.error("Mật khẩu nhập khác nhau");
        return;
      }
      if (password.trim() == "" && usernameOrEmail.trim() == "") {
        toast.error("tài khoản hoặc mật khẩu không được để trống");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error(
        "Bạn cần đồng ý với các điều khoản và điều kiện của chúng tôi",
      );
      return;
    }
    try {
      const responseData: AuthControllerSignUpResponse = await createAccount(
        usernameOrEmail,
        password,
        fullName,
        avatar,
        bio,
      );
      if (responseData.data) {
        const signInResponseDto: SignInResponseDto = responseData.data;
        localStorage.setItem(
          "access_token",
          JSON.stringify(signInResponseDto.access_token),
        );
        localStorage.setItem(
          "refresh_token",
          JSON.stringify(signInResponseDto.refresh_token),
        );
        await UserStoreInfor();
        window.location.reload();
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center flex justify-center items-center space-x-2">
          <span>Đăng Ký</span>
          <IconUser />
        </h2>

        {/* Step indicator */}
        <ul className="steps mb-4">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
            Đăng ký Tài khoản
          </li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
            Nhập Thông tin
          </li>
          <li className={`step ${step === 3 ? "step-primary" : ""}`}>
            Điều khoản & Điều kiện
          </li>
        </ul>

        {step === 1 && (
          <form onSubmit={handleNext}>
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <div className="flex justify-between">
              <button type="submit" className="btn btn-info w-full mr-2">
                Tiếp
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext}>
            <input
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <textarea
              placeholder="Giới thiệu về bản thân"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="textarea textarea-bordered w-full mb-4"
            />
            <div className="flex justify-between w-1/2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary w-full ml-2"
              >
                Trở lại
              </button>
              <button type="submit" className="btn btn-info w-full mr-2">
                Tiếp
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Terms & Conditions */}
        {step === 3 && (
          <form onSubmit={handleRegister}>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="checkbox mr-2"
              />
              Chấp nhận nội quy cộng đồng
            </label>
            <div className="flex justify-between w-1/2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-secondary w-full ml-2"
              >
                Trở lại
              </button>
              <button
                type="submit"
                className="btn btn-info w-full mr-2"
                onClick={() => handleRegister}
              >
                Đăng Kí
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
