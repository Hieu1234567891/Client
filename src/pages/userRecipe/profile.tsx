import { useUsers } from "@/hooks";
import ModalUsersFollow from "@/pages/userRecipe/ModalUsersFollow.tsx";
import useLoginModalStore from "@/store/useLoginModalStore.ts";
import useUserStore from "@/store/userStore.ts";
import {
  IconBookmark,
  IconEdit,
  IconEye,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, getUsersById } = useUsers();
  const [isFollowed, setIsFollowed] = useState<any>(false);
  const { unFollowUser, updateUser2_0, isFollowing, followUser } = useUsers();
  const { openSignInModal } = useLoginModalStore();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(false);
  const [isFollowerUser, setIsFollowerUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const fetchUserData = async () => {
        try {
          const repo = await getUsersById(id);
          if (repo) {
            setIsSave(repo.showSavedRecipes);
            setIsFollowerUser(repo.showFollowers);
            setIsFollowingUser(repo.showFollowing);
          }
          if (localStorage.getItem("refresh_token")) {
            if (id != useUserStore.getState().id) {
              await fetchData(id);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }
  }, [id]);

  const fetchData = async (id_User: string) => {
    const followStatus = await isFollowing(id_User);
    setIsFollowed(followStatus);
  };
  const handleFollowToggle = () => {
    if (id) {
      if (!localStorage.getItem("refresh_token")) {
        openSignInModal();
        return;
      }
      if (!isFollowed) {
        followUser(id);
        setIsFollowed(true);
      } else {
        unFollowUser(id);
        setIsFollowed(false);
      }
    }
  };
  const handleShowSavedRecipesToggle = () => {
    if (user) {
      user.showSavedRecipes = !user.showSavedRecipes;
      updateUser2_0({
        id: user.id,
        requestBody: { showSavedRecipes: user.showSavedRecipes }
      });
      setIsSave(user.showSavedRecipes);
    }
  };
  const handleShowFollowerToggle = () => {
    if (user) {
      user.showFollowers = !user.showFollowers;
      updateUser2_0({
        id: user.id,
        requestBody: { showFollowers: user.showFollowers }
      });
      setIsFollowerUser(user.showFollowers);
    }
  };
  const handleShowSavedFollowingToggle = () => {
    if (user) {
      user.showFollowing = !user.showFollowing;
      updateUser2_0({
        id: user.id,
        requestBody: { showFollowing: user.showFollowing }
      });
      setIsFollowingUser(user.showFollowing);
    }
  };
  if (!user && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);
  return (
    <>
      <div className="bg-base-100 shadow-lg p-6 rounded-lg relative">
        <div className="flex items-center space-x-6">
          <img
            src={user?.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">
              {user?.full_name || "Tên người dùng"}
            </h2>
            <p className="text-gray-500 mb-1">
              @{user?.usernameOrEmail || "Email hoặc tên đăng nhập"}
            </p>
            <p className="text-gray-700">
              {user?.bio || "Giới thiệu về người dùng"}
            </p>
          </div>
        </div>
        <div className="btn btn-circle btn-ghost absolute top-4 right-20 flex items-center">
          <div>
            <button onClick={openModal}>
              <IconEye />
            </button>
            <ModalUsersFollow isOpen={isModalOpen} onClose={closeModal} />
          </div>
        </div>
        {user?.id === useUserStore.getState().id ? (
          <div className="dropdown dropdown-end absolute top-4 right-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost"
            >
              <IconSettings className="w-6 h-6" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-[1] w-56 p-3 shadow-lg"
            >
              <li>
                <a
                  href="/me"
                  className="flex items-center space-x-2 py-2 px-4 hover:bg-base-300 rounded-lg transition-colors duration-200"
                >
                  <IconEdit className="w-5 h-5" />
                  <span>Sửa thông tin</span>
                </a>
              </li>

              <li>
                <span
                  className="flex items-center space-x-2 py-2 px-4 hover:bg-base-300 rounded-lg transition-colors duration-200"
                  title="Toggle saved recipes"
                >
                  <IconBookmark className="w-5 h-5" />
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={isSave}
                    onChange={handleShowSavedRecipesToggle}
                  />
                </span>
              </li>
              <li>
                <span
                  className="flex flex-col items-start space-y-2 py-2 px-4 hover:bg-base-300 rounded-lg transition-colors duration-200"
                  title="Chỉnh sửa quyền riêng tư"
                >
                  <div className="flex items-center space-x-2">
                    <IconUsers className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={isFollowerUser}
                        onChange={handleShowFollowerToggle}
                        title="Hiện/Ẩn đã theo dõi"
                      />
                      <span>Đã theo dõi</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={isFollowingUser}
                        onChange={handleShowSavedFollowingToggle}
                        title="Hiện/Ẩn đang theo dõi"
                      />
                     <span>Đang theo dõi</span>
                    </label>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className={`btn w-full mt-6 ${isFollowed ? "btn-block" : "btn-accent"}`}
            type="button"
            onClick={handleFollowToggle}
          >
            {isFollowed ? "Bỏ theo dõi" : "Theo dõi"}
          </button>
        )}
      </div>
      <div className="bg-base-100 shadow-lg p-6 rounded-lg relative">
        <div className="flex justify-around">
          <Link
            to={`/userDetails/${id}/saved`}
            className={`flex items-center gap-2 ${location.pathname === `/userDetails/${id}/saved` ? "text-yellow-500" : ""}`}
          >
            <IconBookmark />
            <span>
              {user?.id === useUserStore.getState().id
                ? "Công thức đã lưu"
                : `Công thức đã lưu của ${user?.full_name}`}
            </span>
          </Link>
          {user?.id === useUserStore.getState().id && (
            <Link
              to={`/userDetails/${id}/follow`}
              className={`${location.pathname === `/userDetails/${id}/follow` ? "text-yellow-500" : ""}`}
            >
              Đã Follow
            </Link>
          )}
          <Link
            to={`/userDetails/${id}/recipes`}
            className={`${location.pathname === `/userDetails/${id}/recipes` ? "text-yellow-500" : ""}`}
          >
            {user?.id === useUserStore.getState().id
              ? "Công thức của bạn"
              : `Công thức của ${user?.full_name}`}
          </Link>
        </div>
      </div>
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default Profile;
