import { RecipeDto } from "@/client";
import { RecipeTag } from "@/components/recipes";
import { useRecipes } from "@/hooks";
import useUserStore from "@/store/userStore.ts";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";

const UserSaveRecipes: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const {
    fetchRecipeSaveById,
    fetchRecipeSaveByMe,
    totalItem,
    recipeInforAll,
  } = useRecipes();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (id == useUserStore.getState().id) {
        const response = await fetchRecipeSaveByMe(searchTerm, currentPage);
        if (response) setRecipes(response);
      } else {
        console.log(useUserStore.getState().id);

        const response = await fetchRecipeSaveById(id, searchTerm, currentPage);
        if (response) setRecipes(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchData();
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4 space-y-8"></div>;
  }

  if (!recipes) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <p>Không có công thức nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">({totalItem}) Công thức </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm công thức..."
            className="border border-gray-300 rounded-lg p-2 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="absolute left-3 top-2 text-gray-500">
            <IconSearch />
          </span>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-4">
          {recipes.map((recipe) => (
            <RecipeTag recipe={recipe}></RecipeTag>
          ))}
        </div>
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={recipeInforAll?.meta?.total_pages || 1}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSaveRecipes;
