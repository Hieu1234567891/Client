import { filesControllerUpload, UpdateUserDto } from "@/client";
import { useDocumentTitle, useUpdateProfile } from "@/hooks";
import useUserStore, { UserStoreInfor } from "@/store/userStore.ts";
import { useState } from "react";

const Profile = () => {
  useDocumentTitle("Cơm Nhà - Me");
  const [isEditing, setIsEditing] = useState(false);
  const [updateUserDto, setUpdateUserDto] = useState<UpdateUserDto>({
    full_name: "",
    bio: "",
    avatar: "",
  });

  const { UpdateProfile } = useUpdateProfile();
  const { name, username, avatar, bio, id } = useUserStore((state) => ({
    name: state.name,
    username: state.username,
    avatar: state.avatar,
    bio: state.bio,
    id: state.id,
  }));

  const handleEditToggle = () => {
    setUpdateUserDto({
      full_name: name || "",
      bio: bio || "",
      avatar: avatar || "",
    });
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      filesControllerUpload({ formData: { file } }).then((urlResponse) => {
        if (urlResponse.data && urlResponse.data.url) {
          setUpdateUserDto((prev) => ({
            ...prev,
            avatar: urlResponse.data?.url,
          }));
        }
      });
    }
  };

  const handleSaveChanges = async () => {
    const response = await UpdateProfile(updateUserDto);
    if (response) {
      await UserStoreInfor();
      setIsEditing(false);
    }
  };

  if (!id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center p-10 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
          />
          <h1 className="text-2xl font-semibold mt-4">{name}</h1>
          <p className="text-gray-600">{username}</p>
        </div>
        {isEditing ? (
          <div className="w-full text-left space-y-4">
            <div>
              <label className="block text-gray-700">Avatar:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                value={updateUserDto.full_name}
                onChange={(e) =>
                  setUpdateUserDto((prev) => ({
                    ...prev,
                    full_name: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Bio:</label>
              <textarea
                value={updateUserDto.bio}
                onChange={(e) =>
                  setUpdateUserDto((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="w-full text-left">
            <p className="text-gray-700">
              <strong>Bio:</strong> {bio}
            </p>
          </div>
        )}
        <button
          onClick={handleEditToggle}
          className="mt-4 px-4 py-2 bg-gray-300 rounded"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      {/*<div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-6">*/}
      {/*  <div className="flex flex-col items-center mb-6">*/}
      {/*    <h1 className="text-2xl font-semibold mt-4">Món ăn của người dùng</h1>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};

export default Profile;
