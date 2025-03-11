import { UserDto } from "@/client";
import { Pagination } from "@/components/common";
import { ListUserModal } from "@/components/User";
import { useUsers } from "@/hooks";
import useUserStore from "@/store/userStore.ts";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ModalUsersFollowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalUsersFollow: React.FC<ModalUsersFollowProps> = ({
  isOpen,
  onClose,
}) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    "following",
  );
  const {
    fetchFollowingByMe,
    fetchFollowerByMe,
    fetchFollowingById,
    fetchFollowerById,
    totalPage,
  } = useUsers();
  const [users, setUsers] = useState<UserDto[]>([]);
  const currentUserId = useUserStore((state) => state.id);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchData = async () => {
    const isCurrentUser = id == currentUserId;
    console.log(isCurrentUser);
    if (!id) {
      return;
    }
    if (activeTab === "following") {
      const repo = isCurrentUser
        ? await fetchFollowingByMe({ page: currentPage, perPage: 5 })
        : await fetchFollowingById({ id, page: currentPage, perPage: 5 });

      if (repo) {
        setUsers(repo as UserDto[]);
      }
    } else if (activeTab === "followers") {
      const repo = isCurrentUser
        ? await fetchFollowerByMe({ page: currentPage, perPage: 5 })
        : await fetchFollowerById({ id, page: currentPage, perPage: 5 });

      if (repo) {
        setUsers(repo as UserDto[]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, id, currentPage]);


  useEffect(() => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (isOpen) {
      modal.showModal();
      modal.style.cursor = 'default'; // Disable pointer cursor
    } else {
      modal.close();
    }
  }, [isOpen]);



  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "following" ? "tab-active text-yellow-500" : ""}`}
              onClick={() => setActiveTab("following")}
            >
              Người đang theo dõi
            </button>
            <button
              className={`tab ${activeTab === "followers" ? "tab-active text-yellow-500" : ""}`}
              onClick={() => setActiveTab("followers")}
            >
              Đã theo dõi
            </button>
          </div>
        </h3>
        <div className="py-4">
          <ListUserModal users={users} />
        </div>
        {totalPage > 0 && (
          <div className="mt-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalUsersFollow;
