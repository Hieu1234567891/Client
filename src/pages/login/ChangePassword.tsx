import { useAuth } from "@/hooks/index.ts";
import useUserStore from "@/store/userStore.ts";
import { IconFridge } from "@tabler/icons-react";
import { useState } from "react";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); // Thêm state để lưu thông báo lỗi

  if (!isOpen) return null;

  const handleBackground = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Gọi hàm onClose để đóng modal
    }
  };

  const handleChange = async () => {
    if (newPassword !== confirmPassword || newPassword.trim() == "") {
      setError("Mật khẩu không khớp hoặc bị bỏ trống");
      return;
    }

    try {
      await changePassword(useUserStore.getState().id, newPassword);
      onClose();
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackground}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Đổi Mật Khẩu
        </h1>
        <div className="text-xl mb-4 text-center flex justify-center items-center space-x-2">
          <span>Cơm ngon mỗi ngày</span>
          <IconFridge />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}{" "}
        {/* Hiển thị thông báo lỗi */}
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <input
            type="password"
            className="grow"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <input
            type="password"
            className="grow"
            placeholder="Nhập lại Mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Sử dụng state riêng cho nhập lại mật khẩu
          />
        </label>
        <div className="flex justify-between mt-4">
          <button className="btn btn-info w-full mr-2" onClick={handleChange}>
            Đổi Mật Khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
