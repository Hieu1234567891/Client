import { useRecipes } from "@/hooks";
import Profile from "@/pages/userRecipe/profile.tsx";
import { IconBooks } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PreviewProfile = () => {
  // Lấy id từ URL
  const { id } = useParams<{ id: string }>();
  const { searchRecipes, recipes, totalItem } = useRecipes();

  const navigate = useNavigate();

  useEffect(() => {
    searchRecipes({ page: 1, authorId: id, perPage: 3 });
  }, [id]);

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipeDetails/${recipeId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Profile />
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <IconBooks />
          <h3 className="flex items-center">
            <p className="text-xl">Các món &nbsp;</p>
            <p className="font-bold text-xl">({totalItem})</p>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-base-100 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img
                src={recipe.image || "https://via.placeholder.com/300"}
                alt={recipe.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-primary">
                  {recipe.name}
                </h4>
                <p className="text-gray-500 mt-2">
                  {recipe.descriptions || "Mô tả món ăn"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewProfile;
