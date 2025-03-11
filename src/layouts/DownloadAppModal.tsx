import { Link } from "react-router-dom";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal = ({ isOpen, onClose }: DownloadAppModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box bg-white p-8 rounded-2xl shadow-2xl max-w-sm mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Tải ứng dụng</h3>
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <img
            src="https://static.naucomnha.com/a93d5472-594c-484a-9c32-7049a018675a.png"
            alt="QR code for app download"
            className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-md"
          />
          <p className="text-center text-gray-600 text-sm mb-4">Quét mã QR để tải ứng dụng</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 font-medium">Hoặc tải trực tiếp</p>
          <Link
            to="https://api.naucomnha.com/downloads/apk"
            className="transition-transform hover:scale-105"
          >
            <img
              className="w-full h-20 hover:opacity-90"
              loading="lazy"
              alt="APK download"
              src="https://static.naucomnha.com/7c56765b-39ba-4064-9bdd-df6fc98bc714.png"
            />
          </Link>
        </div>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-circle btn-ghost absolute right-2 top-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};