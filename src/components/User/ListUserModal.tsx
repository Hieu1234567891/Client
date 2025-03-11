import { UserDto } from "@/client";
import { IconMoodAnnoyed } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { useUsers } from "@/hooks";
import useUserStore from "@/store/userStore.ts";
import { Link } from "react-router-dom";

interface FollowingUsersListProps {
  users: UserDto[];
}

const ListUserModal: React.FC<FollowingUsersListProps> = ({ users }) => {
  const { isFollowing, unFollowUser, followUser } = useUsers();

  // Assuming user.id is a string; change Record<string, boolean> accordingly
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  // Fetch following status when the component mounts
  useEffect(() => {
    const fetchFollowingStatuses = async () => {
      const statuses: Record<string, boolean> = {};
      for (const user of users) {
        if (localStorage.getItem("refresh_token")) {
          const followingStatus = await isFollowing(user.id);
          statuses[user.id] = followingStatus === true;
        }
      }
      setFollowingStatus(statuses); // Update the state with fetched statuses
    };

    fetchFollowingStatuses();
  }, [users]);

  const handleToggleFollow = async (userId: string) => {
    const isCurrentlyFollowing = followingStatus[userId];

    // Toggle follow/unfollow
    if (isCurrentlyFollowing) {
      await unFollowUser(userId); // Unfollow the user
      setFollowingStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: false
      }));
    } else {
      await followUser(userId); // Follow the user
      setFollowingStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: true
      }));
    }
  };

  return (
    <div>
      {users.length > 0 ? (
        users.map((user: UserDto) => (
          <div key={user.id} className="flex items-center justify-between mb-4 p-4 border-b">
            <Link to={`/userDetails/${user.id}`}>
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar || "https://via.placeholder.com/150"}
                  alt={`${user.full_name || "User"}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p>
                  {user.full_name || "Anonymous"}
                </p>
              </div>
            </Link>
            {user?.id !== useUserStore.getState().id && (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded transition-transform transform hover:scale-105"
                onClick={() => handleToggleFollow(user.id)}
              >
                {followingStatus[user.id] ? "Bỏ theo dõi" : "Theo dõi"}
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center">
          <IconMoodAnnoyed size={64} />
          <p className="text-xl">Không có ai</p>
        </div>
      )}
    </div>
  );
};

export default ListUserModal;
