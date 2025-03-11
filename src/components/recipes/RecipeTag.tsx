import { RecipeDto } from "@/client";
import { convertSecondsToHoursMinutesSeconds } from "@/utils";
import { IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface RecipeTagProps {
  recipe: RecipeDto;
}

const RecipeTag: React.FC<RecipeTagProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipeDetails/${recipeId}`);
  };

  return (
    <div
      className="rounded-xl shadow-lg flex items-center p-5 bg-white hover:cursor-pointer hover:scale-105"
      onClick={() => handleRecipeClick(recipe.id)}
    >
      <div className="absolute top-3 right-20 flex items-center">
        <IconEye />
        <span className="ml-1">{recipe.views}</span>
      </div>

      <img
        src={recipe.image}
        className="w-24 h-24 object-cover rounded-l-xl"
        alt={recipe.name}
      />
      <div className="ml-5 flex-1">
        <h1 className="font-bold text-xl">{recipe.name}</h1>
        <h3 className="font-medium cursor-pointer">
          Mô tả: {recipe.descriptions}
        </h3>
        <h3 className="font-medium cursor-pointer">
          Thời gian ra món: {convertSecondsToHoursMinutesSeconds(recipe.time)}
        </h3>
        <h3 className="font-medium cursor-pointer">
          Số bước làm: {recipe.steps.length}
        </h3>
      </div>
    </div>
  );
};

export default RecipeTag;
