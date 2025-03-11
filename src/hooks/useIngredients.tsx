import {
  CreateIngredientDto,
  filesControllerUpload,
  FilesControllerUploadResponse,
  IngredientDto,
  ingredientsControllerCreate,
  ingredientsControllerFindAll,
  ingredientsControllerFindRandom,
  ingredientsControllerFindTop,
  ingredientsControllerRemove,
  ingredientsControllerUpdate,
  IngredientsControllerUpdateResponse,
  Meta,
  UpdateIngredientDto,
} from "@/client";
import { useEffect, useState } from "react";

const useIngredients = (currentPage: number, searchTerm: string) => {
  const [ingredients, setIngredients] = useState<IngredientDto[]>();
  const [ingredient, setIngredient] = useState<IngredientDto>();
  const [totalPage, setTotalPage] = useState<number>(0);
  const [meta, setMeta] = useState<Meta>();
  useEffect(() => {
    getAllIngredients(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const getAllIngredients = async (currentPage: number, searchTerm: string) => {
    try {
      const response = await ingredientsControllerFindAll({
        perPage: 8,
        page: currentPage,
        q: searchTerm,
      });
      setIngredients(response.data);
      if (response.meta?.total_pages) {
        setTotalPage(response.meta.total_pages);
        setMeta(response.meta);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const upFileImg = async (img: File) => {
    const imgUrl: FilesControllerUploadResponse = await filesControllerUpload({
      formData: { file: img },
    });
    return imgUrl.data?.url;
  };

  const createIngredient = async (ingredient: CreateIngredientDto) => {
    try {
      const response = await ingredientsControllerCreate({
        requestBody: ingredient,
      });
      console.log("taoj thanh cong" + response);
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeIngredient = async (id: string) => {
    try {
      const response = await ingredientsControllerRemove({ id });
      console.log("taoj thanh cong" + response);
    } catch (e) {
      console.log(e);
    }
  };

  const updateIngredient = async (
    ingredient: UpdateIngredientDto,
    id: string,
  ) => {
    try {
      const response: IngredientsControllerUpdateResponse =
        await ingredientsControllerUpdate({
          id,
          requestBody: ingredient,
        });
      setIngredient(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const findRandomIngredients = async ({
    page,
    per_page,
  }: {
    page: number;
    per_page: number;
  }) => {
    try {
      const response = await ingredientsControllerFindRandom({
        perPage: per_page,
        page: page,
      });

      setIngredients(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const findTopIngredients = async ({
    page,
    per_page,
  }: {
    page: number;
    per_page: number;
  }) => {
    try {
      const response = await ingredientsControllerFindTop({
        perPage: per_page,
        page: page,
      });

      setIngredients(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    totalPage,
    ingredients,
    ingredient,
    getAllIngredients,
    updateIngredient,
    upFileImg,
    createIngredient,
    removeIngredient,
    findRandomIngredients,
    findTopIngredients,
    meta,
  };
};

export default useIngredients;
