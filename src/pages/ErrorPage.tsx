import { useDocumentTitle } from "@/hooks";

const ErrorPage: React.FC = () => {
  useDocumentTitle("Không tìm thấy trang");
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 ">
      <div className="text-center bg-white p-8 rounded-lg shadow-2xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
          Sắp ra mắt
        </h1>
        <p className="text-2xl mt-6 text-gray-700">
          Trang này sẽ ra mắt vào sắp tới
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Xin quay lại trang chủ
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
