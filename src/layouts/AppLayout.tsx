import ChangePassword from "@/pages/login/ChangePassword.tsx";
import useLoginModalStore from "@/store/useLoginModalStore.ts";
import useRegisterModalStore from "@/store/useRegisterModalStore.ts";
import useUserStore, { clearUserInfo } from "@/store/userStore.ts";
import {
  IconBell,
  IconBrandGmail,
  IconChefHat, IconDownload,
  IconHome, IconHomeLink,
  IconLogout,
  IconPasswordUser, IconPhoneCall,
  IconPlus,
  IconSearch,
  IconUserCircle,
  IconVip
} from "@tabler/icons-react";
import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingBarProvider } from "./LoadingBarContext";
import { useAuth } from "@/hooks";
import { DownloadAppModal } from "@/layouts/DownloadAppModal.tsx";

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const { signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
    const handleLogout = () => {
      const sioutRequest = {
        access_token: localStorage.getItem("access_token") || "",
        refresh_token: localStorage.getItem("refresh_token") || ""
      };
      localStorage.clear();
      clearUserInfo();
      signOut({ requestBody: sioutRequest });
      window.location.href = "/";
    };

    return (
      <div className="flex items-center">
        {useUserStore.getState().avatar ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="AVATAR" src={useUserStore.getState().avatar} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={`/userDetails/${useUserStore.getState().id}`}>
                  <IconChefHat />
                  Bếp của Bạn
                </Link>
              </li>
              <li>
                <Link to="/me">
                  <IconUserCircle />
                  Thông tin cá nhân
                </Link>
              </li>
              <li>
                <a
                  onClick={() => setOpenChangePasswordModal(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <IconPasswordUser />
                  <span>Đổi mật khẩu</span>
                </a>
              </li>
              <li>
                <a onClick={handleLogout}>
                  <IconLogout />
                  Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline mr-2 text-[1em] rounded-md min-w-32"
              onClick={onLoginClick}
            >
              Đăng nhập
            </button>
            <button
              className="btn btn-warning text-[1em] rounded-md min-w-32"
              onClick={onRegisterClick}
            >
              Đăng ký
            </button>
          </>
        )}
      </div>
    );
  };

  const { openSignInModal } = useLoginModalStore();
  const { openSignUpModal } = useRegisterModalStore();

  const [openChangePasswordModal, setOpenChangePasswordModal] =
    useState<boolean>(false);

  return (
    <LoadingBarProvider>
      <ToastContainer />

      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col min-h-screen">
          <div className="navbar bg-base-100 text-base-content sticky top-0 z-40 shadow-md">
            <div className="flex-none">
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2">
              <Link to="/" className="text-2xl font-bold flex items-center">
                <img
                  src="https://static.naucomnha.com/images/8877db0c-fd05-4415-9c8d-a146bd5f93be.png"
                  alt="Cơm Nhà LOGO"
                  className="w-10 h-10 mr-2"
                />
                <span>Cơm Nhà</span>
              </Link>
            </div>
            {useUserStore.getState().avatar ? (
              <div className="flex-none space-x-4">
                <div className="flex justify-center items-center w-full bg-base-100 py-2">
                  <Link
                    to="/"
                    className="flex flex-col items-center mx-4 cursor-pointer"
                  >
                    <IconHome
                      className={
                        isActive("/") ? "text-orange-500" : "text-gray-500"
                      }
                      size={24}
                    />
                    <span
                      className={
                        isActive("/")
                          ? "text-xs text-orange-500"
                          : "text-xs text-gray-500"
                      }
                    >
                      Trang Chủ
                    </span>
                  </Link>

                  <Link
                    to="/search/recipes"
                    className="flex flex-col items-center mx-4 cursor-pointer"
                  >
                    <IconSearch
                      className={
                        isActive("/search/recipes")
                          ? "text-orange-500"
                          : "text-gray-500"
                      }
                      size={24}
                    />
                    <span
                      className={
                        isActive("/search/recipes")
                          ? "text-xs text-orange-500"
                          : "text-xs text-gray-500"
                      }
                    >
                      Tìm Kiếm
                    </span>
                  </Link>

                  <Link
                    to="/recipe/edit/"
                    className="flex flex-col items-center mx-4 cursor-pointer"
                  >
                    <IconPlus
                      className={
                        isActive("/recipe/edit/")
                          ? "text-orange-500"
                          : "text-gray-500"
                      }
                      size={24}
                    />
                    <span
                      className={
                        isActive("/recipe/edit/")
                          ? "text-xs text-orange-500"
                          : "text-xs text-gray-500"
                      }
                    >
                      Viết món mới
                    </span>
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex flex-col items-center mx-4 cursor-pointer relative"
                  >
                    <IconBell
                      className={
                        isActive("/notifications")
                          ? "text-orange-500"
                          : "text-gray-500"
                      }
                      size={24}
                    />
                    <span
                      className={
                        isActive("/notifications")
                          ? "text-xs text-orange-500"
                          : "text-xs text-gray-500"
                      }
                    >
                      Tương Tác
                    </span>
                  </Link>


                  <Link
                    to="/premium"
                    className="flex flex-col items-center mx-4 cursor-pointer"
                  >
                    <IconVip
                      className={
                        isActive("/premium")
                          ? "text-orange-500"
                          : "text-gray-500"
                      }
                      size={24}
                    />
                    <span
                      className={
                        isActive("/premium")
                          ? "text-xs text-orange-500"
                          : "text-xs text-gray-500"
                      }
                    >
                      Gói Premium
                    </span>
                  </Link>
                  <div
                    className="flex flex-col items-center mx-4 cursor-pointer relative"
                    onClick={() => setIsDownloadModalOpen(true)}
                  >
                    <IconDownload
                      className={
                        isDownloadModalOpen
                          ? "text-orange-500"
                          : "text-gray-500"
                      }
                      size={24}
                    />
                    <span
                      className={
                        isDownloadModalOpen
                          ? "text-xs text-orange-500"
                          : "text-xs text-gray-500"
                      }
                    >
                      Tải ứng dụng
                    </span>
                  </div>
                </div>
                <Header
                  onLoginClick={openSignInModal}
                  onRegisterClick={openSignUpModal}
                />
              </div>
            ) : (
              <Header
                onLoginClick={openSignInModal}
                onRegisterClick={openSignUpModal}
              />
            )}
          </div>
          <main className="flex-grow p-4 bg-base-200">{children}</main>
          <footer className="bg-amber-100 shadow-lg text-primary-content py-12 mt-auto">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                {/* Left Column */}
                <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4">CƠM NHÀ</h2>
                  <p className="mb-4">Website và Ứng dụng giúp bạn nấu ăn từ những nguyên liệu sẵn có</p>
                  <hr className="my-4 border-gray-400" />
                  <div>
                    <p>
                      <a href="https://www.facebook.com/profile.php?id=61565903407292&_rdc=1&_rdr"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="font-bold hover:text-blue-600">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/900px-Facebook_Logo_%282019%29.png"
                          alt="Facebook Logo"
                          className="w-6 h-6 inline-block mr-2"
                        />
                        Liên hệ Cơm nhà
                      </a>
                    </p>
                    <p className="flex items-center mb-2 justify-center md:justify-start mt-4">
                      <IconChefHat className="mr-2" /> Trang · Nhà bếp/Nấu ăn · Sức khỏe/Sắc đẹp · Chuyên gia dinh dưỡng
                    </p>
                    <p className="flex items-center mb-2 justify-center md:justify-start">
                      <IconHomeLink className="mr-2" />Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – 29Km Đại lộ
                      Thăng Long, H. Thạch Thất, TP. Hà Nội
                    </p>
                    <p className="flex items-center mb-2 justify-center md:justify-start">
                      <IconPhoneCall className="mr-2" />085 559 7726
                    </p>
                    <p className="flex items-center mb-2 justify-center md:justify-start">
                      <a href="mailto:hotro@naucomnha.com" className="flex items-center">
                        <IconBrandGmail className="mr-2" />hotro@naucomnha.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:w-1/2 flex flex-col items-center md:items-end h-32 md:h-20">
                  <h3 className="text-2xl font-bold mb-4 text-right">Tải ứng dụng Cơm Nhà ngay!</h3>
                  <div className="flex flex-col items-center md:items-center space-y-4">
                    <Link to="https://api.naucomnha.com/downloads/apk">
                        <img
                          className="w-full h-14"
                          loading="lazy"
                          alt="APK download"
                          src="https://static.naucomnha.com/7c56765b-39ba-4064-9bdd-df6fc98bc714.png"
                        />
                    </Link>

                    <div className="text-center mt-4">
                      <p className="mb-2">Tải với QR code</p>
                      <img
                        className="w-40 h-40"
                        loading="lazy"
                        width="55"
                        height="20"
                        alt="Qr tải ứng dụng Cơm Nhà"
                        src="https://static.naucomnha.com/a93d5472-594c-484a-9c32-7049a018675a.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <div className="drawer-side z-50">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col justify-between">
            <div>
              <li>
                <Link to="/">Trang Chủ</Link>
              </li>
              <li>
                <Link to="/search/ingredients">Tìm Kiếm Nguyên Liệu</Link>
              </li>
              <li>
                <Link to="/search/recipes">
                  Tìm Kiếm Món Ăn từ nguyên liệu sẵn có
                </Link>
              </li>
              <li>
                <Link to="/premium">Gói Premium</Link>
              </li>
              {useUserStore.getState().avatar ? (
                <>{/* You can add more links here if needed */}</>
              ) : (
                <>
                  <li>
                    <a onClick={openSignUpModal}>Đăng ký</a>
                  </li>
                  <li>
                    <a onClick={openSignInModal}>Đăng nhập</a>
                  </li>
                </>
              )}
            </div>

            {/* Image at the bottom */}
            <div className="mt-4 mb-6 ">
              {" "}
              {/* Adjusted margin to move image up */}
              <img
                src="https://global-web-assets.cpcdn.com/assets/footer/footer-210d183ce6443eb41fa78f10b270fb773bab56416e2680a35328f51e8ddf85d0.png"
                alt="Footer Image"
                className="w-full h-auto object-cover"
              />
            </div>
          </ul>
        </div>

        <ChangePassword
          isOpen={openChangePasswordModal}
          onClose={() => setOpenChangePasswordModal(false)}
        />
        <DownloadAppModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
        />
      </div>
    </LoadingBarProvider>
  );
};

export default AppLayout;
