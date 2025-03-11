import { RecipeDto } from "@/client";
import { InfiniteScroll } from "@/components/common";
import { useRecipes, useUsers } from "@/hooks";
import useUserStore from "@/store/userStore.ts";
import { convertSecondsToHoursMinutesSeconds } from "@/utils";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconClock,
  IconDots,
  IconEye,
  IconUserMinus,
  IconUserPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RecipePaginationProps {
  searchTerm: string;
  recipes: RecipeDto[];
  totalItem: number;
  hasMore: boolean;
  fetchMore: () => void;
}

const RecipePagination: React.FC<RecipePaginationProps> = ({
  searchTerm,
  recipes,
  totalItem,
  hasMore,
  fetchMore,
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFollowed, setIsFollowed] = useState<any>(false);
  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipeDetails/${recipeId}`);
  };

  const { isSaveRecipe, unSaveRecipe, saveRecipe } = useRecipes();
  const { unFollowUser, isFollowing, followUser } = useUsers();
  const [isLoading, setIsLoading] = useState(true);

  const userAction = async (id_recipe: string, id_user: string) => {
    setIsLoading(true);
    try {
      const [savedStatus, followStatus] = await Promise.all([
        isSaveRecipe(id_recipe),
        isFollowing(id_user),
      ]);

      setIsSaved(savedStatus ?? false);
      setIsFollowed(followStatus);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {searchTerm !== "" ? (
        <div className="mt-4 flex text-2xl">
          <p>Các công thức với</p> &nbsp;
          <p className="font-bold">{searchTerm}</p> &nbsp;
          <p>({totalItem})</p>
        </div>
      ) : (
        <div className="mt-4 flex text-2xl">
          <p className="font-bold">{totalItem}</p> &nbsp;
          <p>công thức</p>
        </div>
      )}
      <InfiniteScroll
        loader={<span className="loading loading-dots loading-lg"></span>}
        className="w-full float-left my-2"
        fetchMore={fetchMore}
        hasMore={hasMore}
        endMessage={<p>Bạn đã xem hết công thức!</p>}
      >
        {recipes.map((recipe, index) => (
          <div
            className="card card-side bg-white shadow-xl my-2 hover:cursor-pointer hover:bg-base-100"
            key={index}
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <div className="absolute top-3 right-20 flex items-center">
              <IconEye />
              <span className="ml-1">{recipe.views}</span>
            </div>
            {recipe.author?.id !== useUserStore.getState().id &&
              useUserStore.getState().id && (
                <div className="dropdown dropdown-end absolute top-0 right-0">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      userAction(recipe.id, recipe.author.id);
                    }}
                  >
                    <IconDots />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    {isLoading ? (
                      <li className="flex justify-center p-2">
                        <span className="loading loading-dots loading-lg"></span>
                      </li>
                    ) : (
                      <>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isFollowed) {
                                unFollowUser(recipe.author.id);
                                setIsFollowed(false);
                              } else {
                                followUser(recipe.author.id);
                                setIsFollowed(true);
                              }
                            }}
                          >
                            {isFollowed ? (
                              <>
                                <IconUserMinus className="text-blue-500" /> Đã
                                theo dõi {recipe.author.full_name}
                              </>
                            ) : (
                              <>
                                <IconUserPlus className="text-gray-500" /> Theo
                                dõi {recipe.author.full_name}
                              </>
                            )}
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isSaved) {
                                unSaveRecipe(recipe.id);
                                setIsSaved(false);
                              } else {
                                saveRecipe(recipe.id);
                                setIsSaved(true);
                              }
                            }}
                          >
                            {isSaved ? (
                              <>
                                <IconBookmarkFilled className="text-yellow-500" />{" "}
                                Đã lưu
                              </>
                            ) : (
                              <>
                                <IconBookmark className="text-gray-500" /> Lưu
                                món
                              </>
                            )}
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            <div className="w-44 h-44 flex-shrink-0 overflow-hidden">
              <img
                src={recipe?.image||"https://static.naucomnha.com/images/e8274e03-5838-458b-bb61-b1e60ebd3c53.png"}
                className="w-44 h-full object-cover rounded-l-xl"
                alt={recipe.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://static.naucomnha.com/images/e8274e03-5838-458b-bb61-b1e60ebd3c53.png"; // URL hình ảnh dự phòng
                }}
              />
            </div>

            <div className="card-body p-4">
              <h2 className="card-title cursor-pointer">{recipe.name}</h2>
              <p className="text-sm">
                {recipe.ingredients.map((ingredient, ingrId) => (
                  <span key={ingredient.ingredient.id}>
                    {ingredient.ingredient.name}
                    {ingrId !== recipe.ingredients.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p className="font-medium text-gray-600 flex items-center text-sm">
                <IconClock size={"1em"} className="mr-1" />
                <span>{convertSecondsToHoursMinutesSeconds(recipe.time)}</span>
              </p>
              <div className="avatar flex items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={recipe?.author?.avatar || "https://www.bodyandsoulhealthclub.com/wp-content/uploads/2019/01/null-user.jpg"}
                    alt={recipe.author.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://static.naucomnha.com/images/e8274e03-5838-458b-bb61-b1e60ebd3c53.png"; // URL hình ảnh dự phòng
                    }}
                  />
                </div>
                <p className="font-medium ml-2 text-sm">
                  {recipe.author.full_name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default RecipePagination;
