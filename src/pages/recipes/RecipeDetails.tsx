import { Box } from "@/components/common";
import { useDocumentTitle, useRecipes, useUsers } from "@/hooks";
import useUserStore from "@/store/userStore.ts";
import { convertSecondsToHoursMinutesSeconds, shortenName } from "@/utils";
import {
  IconAlarm,
  IconBookmark,
  IconClock,
  IconMeat,
  IconNotes,
  IconToolsKitchen2,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
  IconUserStar
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const {
    recipe,
    fetchRecipe,
    deleteRecipe,
    isSaveRecipe,
    unSaveRecipe,
    saveRecipe
  } = useRecipes();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFollowed, setIsFollowed] = useState<any>(false);
  useDocumentTitle("Công Thức " + recipe?.name);
  const { unFollowUser, isFollowing, followUser } = useUsers();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const repo = await fetchRecipe(id || "");
      setIsLoading(false);
      if (id && localStorage.getItem("refresh_token") && repo) {
        setIsCheckingStatus(true);
        const savedStatus = await isSaveRecipe(id);
        const followStatus = await isFollowing(repo.author.id);
        setIsSaved(savedStatus || false);
        setIsFollowed(followStatus);
        setIsCheckingStatus(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || !recipe) {
    return (
      <div className="pl-48 pr-48 pt-3 flex flex-row">
        <div className="w-2/3">
          <figure className="skeleton w-full h-96 rounded-lg mb-4"></figure>
          <Box className="mb-2">
            <div className="skeleton h-8 w-1/2 mb-2"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </Box>

          <Box className="mt-3 flex items-center">
            <div className="skeleton h-6 w-1/3"></div>
          </Box>

          <Box className="mt-3">
            <div className="flex w-full items-start">
              <div className="card bg-base-300 rounded-box grid h-auto flex-grow place-items-center p-4">
                <div className="skeleton h-6 w-1/4 mb-2"></div>
                <ul className="list-disc pl-4 min-h-[50px]">
                  <li className="skeleton h-4 w-3/4 mb-1"></li>
                  <li className="skeleton h-4 w-2/3"></li>
                </ul>
              </div>
              <div className="divider divider-horizontal"></div>
              <div className="card bg-base-300 rounded-box grid h-auto flex-grow place-items-center p-4">
                <div className="skeleton h-6 w-1/4 mb-2"></div>
                <ul className="list-disc pl-4 min-h-[50px]">
                  <li className="skeleton h-4 w-3/4 mb-1"></li>
                  <li className="skeleton h-4 w-2/3"></li>
                </ul>
              </div>
            </div>
          </Box>

          <Box className="mt-3">
            <div className="skeleton h-6 w-1/4 mb-2"></div>
            <div className="skeleton h-4 w-full mb-1"></div>
            <div className="skeleton h-4 w-5/6"></div>
          </Box>
        </div>

        <div className="ml-6 w-auto h-screen flex-1 sticky top-[5em]">
          <Box>
            <div className="flex items-center">
              <div className="avatar skeleton rounded-full w-12 h-12"></div>
              <div className="ml-3 flex flex-col w-full">
                <div className="skeleton h-6 w-1/3 mb-1"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
              <div className="ml-auto skeleton h-8 w-1/4 rounded-md"></div>
            </div>
          </Box>

          <Box className="mt-3">
            <div className="skeleton h-8 w-full rounded-md"></div>
            <div className="skeleton h-8 w-full mt-3 rounded-md"></div>
          </Box>

          <Box className="mt-3">
            <div className="skeleton h-6 w-1/2"></div>
          </Box>
        </div>
      </div>
    );
  }

  const {
    image,
    name,
    equipments,
    descriptions,
    time,
    ingredients,
    steps,
    author
  } = recipe;

  function handleDeleteRecipe(id: string | undefined) {
    if (id) {
      if (window.confirm("Bạn có chắc chắn muốn xóa công thức này không?")) {
        deleteRecipe(id).then(() => {
          console.log("Recipe deleted successfully");
          navigate("/search/recipes");
        });
      }
    } else {
      console.error("Cannot delete recipe: ID is undefined");
      alert("Không thể xóa công thức: ID không xác định.");
    }
  }

  const handleSaveRecipe = () => {
    if (id) {
      if (!isSaved) {
        saveRecipe(id).then((status) => {
          if (status !== 401) {
            console.log("Recipe saved successfully");
            setIsSaved(true);
          } else {
            console.error("Error saving recipe");
          }
        });
      } else {
        unSaveRecipe(id).then((status) => {
          if (status !== 401) {
            setIsSaved(false);
            console.log("Recipe unsaved successfully");
          } else {
            console.error("Error unsaving recipe");
          }
        });
      }
    }
  };
  const handleFollowUser = () => {
    if (author.id) {
      if (!isFollowed) {
        followUser(author.id).then((status) => {
          if (status !== 401) {
            setIsFollowed(true);
          } else {
            console.error("Error following user");
          }
        });
      } else {
        unFollowUser(author.id).then((status) => {
          if (status !== 401) {
            console.log("User unfollowed successfully");
            setIsFollowed(false);
          } else {
            console.error("Error unfollowing user");
          }
        });
      }
    }
  };

  return (
    <div className="pl-48 pr-48 pt-3 flex flex-row">
      <div className="w-2/3">
        <figure className="">
          <PhotoProvider>
            <PhotoView src={image}>
              <img
                src={image}
                alt={name}
                className="rounded-lg mb-4 object-cover hover:cursor-pointer"
                style={{ width: "60rem", height: "25rem" }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://static.naucomnha.com/images/e8274e03-5838-458b-bb61-b1e60ebd3c53.png"; // URL hình ảnh dự phòng
                }}
              />
            </PhotoView>
          </PhotoProvider>
        </figure>
        <Box className="mb-2">
          <h2 className="text-4xl font-bold">{name}</h2>
          <p className="mt-3 text-xl">{descriptions}</p>
        </Box>

        <Box className="mt-3 flex items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <IconAlarm size={"2em"} className="mr-1" />
            <p>
              Thời gian: {time && convertSecondsToHoursMinutesSeconds(time)}
            </p>
          </h3>
        </Box>

        <Box className="mt-3">
          <div className="flex w-full items-start">
            <div className="card bg-base-300 rounded-box grid h-auto flex-grow place-items-center p-4">
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <IconMeat size={"2em"} className="mr-1" />
                Nguyên liệu:
              </h3>
              <ul className="list-disc pl-4 min-h-[50px]">
                {ingredients &&
                  ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <PhotoProvider>
                        <PhotoView src={ingredient.ingredient.image}>
                          <a href="#" className="font-medium hover:underline">
                            {ingredient.ingredient.name}
                          </a>
                        </PhotoView>
                      </PhotoProvider>
                      : {ingredient.quantity}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="card bg-base-300 rounded-box grid h-auto flex-grow place-items-center p-4">
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <IconToolsKitchen2 size={"2em"} className="mr-1" />
                Dụng cụ:
              </h3>
              <ul className="list-disc pl-4 min-h-[50px]">
                {equipments &&
                  equipments.map((equipment, index) => (
                    <li key={index}>
                      <PhotoProvider>
                        <PhotoView src={equipment.image}>
                          <a href="#" className="font-medium hover:underline">
                            {equipment.name}
                          </a>
                        </PhotoView>
                      </PhotoProvider>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Box>
        <Box className="mt-3">
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <IconNotes size={"2em"} className="mr-1" />
            Hướng dẫn nấu ăn:
          </h3>
          {steps &&
            steps.map((step, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-medium mb-2 ">
                  <div className="badge badge-info"> {`Bước ${index + 1}`}</div>
                </h4>
                <div className="mb-2 font-bold flex items-center">
                  <IconClock className="mr-2" />
                  {convertSecondsToHoursMinutesSeconds(step.time)}
                </div>
                <div className="mb-2">{step.step}</div>
                <div className="flex gap-2 pr-3">
                  {step.images && step.images.length > 0 ? (
                    step.images.map((image, imgIndex) => (
                      <PhotoProvider>
                        <PhotoView src={image}>
                          <img
                            key={imgIndex}
                            src={image || "default-image-url"}
                            alt={`Step ${index + 1}`}
                            className="w-1/3 rounded-lg hover:cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://static.naucomnha.com/images/e8274e03-5838-458b-bb61-b1e60ebd3c53.png"; // URL hình ảnh dự phòng
                            }}
                          />
                        </PhotoView>
                      </PhotoProvider>
                    ))
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            ))}
        </Box>
      </div>

      <div className="ml-6 w-auto h-screen flex-1 sticky top-[5em]">
        <Box>
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <Link to={`/userDetails/${author.id}`}>
                  <img
                    src={author.avatar || "12312"}
                    alt={author.full_name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://www.bodyandsoulhealthclub.com/wp-content/uploads/2019/01/null-user.jpg"; // URL hình ảnh dự phòng
                    }}
                  />

                </Link>
              </div>
            </div>
            <div className="ml-3 flex flex-col">
              <p className="font-medium">{author.full_name || "Unknown"}</p>
              <div className="flex items-center">
                <IconUserStar width={"1em"} />
                <p className="ml-1">
                  {shortenName(author.bio) || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        </Box>

        {author.id === useUserStore.getState().id ? (
          <Box className="mt-3">
            <Link
              to={`/recipe/edit/${id}`}
              className="btn btn-outline rounded-md w-full mt-3 flex items-center justify-center"
            >
              Chỉnh sửa món ăn
            </Link>
            <button
              onClick={() => handleDeleteRecipe(id)}
              className="btn btn-outline btn-error rounded-md w-full mt-3 flex items-center justify-center"
            >
              <IconTrash className="mr-2" />
              Xóa món ăn
            </button>
          </Box>
        ) : (
          <Box className="mt-3">
            {isCheckingStatus === true ? (
              <>loading...</>
            ) : (
              <>
                <label className="swap swap-flip btn btn-accent  rounded-md w-full flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSaved}
                    onChange={handleSaveRecipe}
                  />
                  <div className="swap-on flex items-center justify-center absolute">
                    <IconBookmark className="mr-1" fill="currentColor" />
                    <p className="font-bold">Đã lưu công thức</p>
                  </div>
                  <div className="swap-off flex items-center btn-block justify-center absolute">
                    <IconBookmark
                      className="mr-1"
                      fill="none"
                      stroke="currentColor"
                    />
                    <p className="font-bold">Lưu công thức nấu ăn</p>
                  </div>
                </label>
                <button
                  className="btn btn-outline rounded-md w-full mt-3 flex items-center justify-center"
                  onClick={handleFollowUser}
                >
                  {isFollowed ? (
                    <>
                      <IconUserMinus className="mr-1" />
                      <p className="font-bold">Bỏ theo dõi</p>
                    </>
                  ) : (
                    <>
                      <IconUserPlus className="mr-1" />
                      <p className="font-bold">Theo dõi</p>
                    </>
                  )}
                </button>
              </>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
