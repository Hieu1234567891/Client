import { RecipeTag } from "@/components/recipes";
import { useRecipes } from "@/hooks";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination.tsx";
const UserRecipes = () => {
  const { id } = useParams<{ id: string }>();
  const { searchRecipes, recipes, totalItem, recipeInforAll } = useRecipes();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    searchRecipes({
      page: currentPage,
      q: searchTerm,
      authorId: id,
      perPage: 8,
    });
  }, [currentPage, id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      searchRecipes({ page: 1, q: searchTerm, authorId: id, perPage: 8 });
    }
  };

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

export default UserRecipes;
