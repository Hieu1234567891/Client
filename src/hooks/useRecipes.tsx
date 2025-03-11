import {
  CreateRecipeDto,
  filesControllerUpload,
  FilesControllerUploadResponse,
  RecipeDto,
  recipesControllerCreate,
  recipesControllerFindAllByAny,
  RecipesControllerFindAllByAnyResponse,
  recipesControllerFindFromFollowingAuthors,
  RecipesControllerFindFromFollowingAuthorsData,
  recipesControllerFindOne,
  recipesControllerIsSaved,
  recipesControllerRemove,
  recipesControllerSaveRecipe,
  recipesControllerUnsaveRecipe,
  recipesControllerUpdate,
  UpdateRecipeDto,
  usersControllerFindMySavedRecipes,
  usersControllerFindSavedRecipes,
} from "@/client";
import { useLoadingBar } from "@/layouts/LoadingBarContext.tsx";
import { useState } from "react";

const useRecipes = () => {
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [recipe, setRecipe] = useState<RecipeDto | null>(null);
  const [totalItem, setTotalItem] = useState(0);
  const [page, setPage] = useState(1);
  const [recipeInforAll, setRecipeInforAll] =
    useState<RecipesControllerFindAllByAnyResponse | null>(null);
  const { startLoading, completeLoading } = useLoadingBar();

  const fetchRecipe = async (recipeId: string) => {
    try {
      startLoading();
      const response = await recipesControllerFindOne({ id: recipeId });
      if (response.data) {
        setRecipe(response.data);
        completeLoading();
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
    }
  };

  const createRecipe = async (recipeData: CreateRecipeDto) => {
    try {
      const response = await recipesControllerCreate({
        requestBody: recipeData,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const updateRecipe = async (
    recipeId: string,
    recipeData: UpdateRecipeDto,
  ) => {
    try {
      const response = await recipesControllerUpdate({
        id: recipeId,
        requestBody: recipeData,
      });
      console.log(`Recipe ${recipeId} updated:`, response);
    } catch (error) {
      console.error(`Error updating recipe ${recipeId}:`, error);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      const response = await recipesControllerRemove({ id: recipeId });
      console.log(`Recipe ${recipeId} deleted:`, response);
    } catch (error) {
      console.error(`Error deleting recipe ${recipeId}:`, error);
    }
  };
  const upFileImg = async (img: File) => {
    startLoading();
    const imgUrl: FilesControllerUploadResponse = await filesControllerUpload({
      formData: { file: img },
    });
    startLoading();
    return imgUrl.data?.url;
  };
  const searchRecipes = async (RecipesControllerFindAllByAnyData = {}) => {
    startLoading();
    try {
      const response = await recipesControllerFindAllByAny(
        RecipesControllerFindAllByAnyData,
      );
      if (response.data) {
        setRecipes(response.data);
        setPage(1); // Đặt lại page về index
        setTotalItem(response.meta?.total_items || 0);
        setRecipeInforAll(response);
      }
      completeLoading();
      return response;
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw error;
    }
  };

  const fetchRecipes = async (
    index: number,
    keySearch?: string,
    ids?: string[],
  ) => {
    startLoading();
    try {
      const response = await recipesControllerFindAllByAny({
        perPage: 4,
        page: index,
        q: keySearch,
        ingredientIds: ids,
      });
      if (response.data) {
        setRecipes((prevRecipes) => [...prevRecipes, ...(response.data || [])]);
        setRecipeInforAll(response);
      }
      completeLoading();
      return response;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  };
  const saveRecipe = async (recipe_Id: string) => {
    try {
      const response = await recipesControllerSaveRecipe({
        id: recipe_Id,
      });
      console.log(`Recipe ${recipe_Id} saved:`, response);

    } catch (error) {
      console.error(`Error saving recipe ${recipe_Id}:`, error);
      return 401;
    }
  };
  const unSaveRecipe = async (recipe_Id: string) => {
    try {
      const response = await recipesControllerUnsaveRecipe({
        id: recipe_Id,
      });
      console.log(`Recipe ${recipe_Id} unsaved:`, response);

    } catch (error) {
      console.error(`Error unsaving recipe ${recipe_Id}:`, error);
      return 401;
    }
  };

  const isSaveRecipe = async (recipe_Id: string) => {
    try {
      const response = await recipesControllerIsSaved({
        id: recipe_Id,
      });
      console.log(`Recipe ${recipe_Id} saved:`, response);
      if (response.data) {
        return response.data.isSaved;
      }
    } catch (error) {
      console.error(`Error saving recipe ${recipe_Id}:`, error);
    }
  };
  const fetchRecipeSaveById = async (
    id_User: string,
    keySearch?: string,
    page?: number,
  ) => {
    try {
      startLoading();
      const response = await usersControllerFindSavedRecipes({
        id: id_User,
        perPage: 7,
        page: page,
        q: keySearch,
      });
      if (response.data) {
        setTotalItem(response.meta?.total_items || 0);
        setRecipeInforAll(response);

        completeLoading();
        return response.data.filter((recipe) => recipe !== null);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };
  const fetchRecipeSaveByMe = async (keySearch?: string, page?: number) => {
    try {
      startLoading();
      const response = await usersControllerFindMySavedRecipes({
        perPage: 7,
        page: page,
        q: keySearch,
      });
      if (response.data) {
        setTotalItem(response.meta?.total_items || 0);
        setRecipeInforAll(response);

        completeLoading();
        return response.data.filter((recipe) => recipe !== null);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };
  const fetchRecipeFollowById = async (
    data: RecipesControllerFindFromFollowingAuthorsData,
  ) => {
    startLoading();
    try {
      const response = await recipesControllerFindFromFollowingAuthors(data);
      if (response.data) {
        setTotalItem(response.meta?.total_items || 0);
        setRecipeInforAll(response);

        completeLoading();
        return response.data.filter((recipe) => recipe !== null);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  return {
    fetchRecipeFollowById,
    fetchRecipeSaveByMe,
    recipes,
    recipe,
    setRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    fetchRecipe,
    upFileImg,
    fetchRecipes,
    totalItem,
    page,
    setPage,
    recipeInforAll,
    saveRecipe,
    unSaveRecipe,
    isSaveRecipe,
    fetchRecipeSaveById,
  };
};

export default useRecipes;
