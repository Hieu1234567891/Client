import {
  CreateRecipeDto,
  CreateRecipeIngredientDto,
  RecipeDto,
  RecipeIngredientDto,
  RecipeStepDto,
  UpdateRecipeDto,
} from "@/client";
import { useDocumentTitle } from "@/hooks";
import SelectEquipments from "@/pages/recipes/Recipe_Modify/SelectEquipments.tsx";
import StepModal from "@/pages/recipes/Recipe_Modify/StepModal.tsx";
import useUserStore from "@/store/userStore.ts";
import { convertSecondsToHoursMinutesSeconds } from "@/utils";
import { IconFolders } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useRecipes from "../../../hooks/useRecipes.tsx";
import SelectIngredients from "./SelectIngredients.tsx";

const Recipe_Modify: React.FC = () => {
  useDocumentTitle("Viết công thức mới");

  const { id } = useParams();
  const { fetchRecipe, createRecipe, updateRecipe, upFileImg } = useRecipes();
  const [mode] = useState<"create" | "edit">(id ? "edit" : "create");
  const [inputMethod, setInputMethod] = useState<"file" | "url">("url");
  const [imageSource, setImageSource] = useState<string>("");
  const [recipeDTO, setRecipeDTO] = useState<CreateRecipeDto | UpdateRecipeDto>(
    {
      image: "",
      name: "",
      descriptions: "",
      time: 0,
      steps: [],
      ingredients: [],
      equipmentIds: [],
      authorId: useUserStore.getState().id,
    },
  );
  const [recipeEquipmentList, setRecipeEquipmentList] = useState<string[]>([]);
  const [recipeIngredientList, setRecipeIngredientList] = useState<
    CreateRecipeIngredientDto[]
  >([]);
  const [recipe, setRecipe] = useState<RecipeDto>();

  const fetchData = async () => {
    if (mode === "edit") {
      const repo = await fetchRecipe(id ?? "");
      if (repo) {
        setRecipe(repo);
        setImageSource(repo.image);

        const equipmentIds = repo.equipments?.map((eq) => eq.id) || [];

        const formattedIngredients =
          repo.ingredients?.map((ingredient: RecipeIngredientDto) => ({
            ingredient_id: ingredient.ingredient.id,
            quantity: ingredient.quantity,
          })) || [];

        // Set the Recipe DTO
        setRecipeDTO({
          image: repo.image,
          name: repo.name,
          descriptions: repo.descriptions,
          time: repo.time,
          steps: repo.steps,
          equipmentIds: equipmentIds,
          ingredients: formattedIngredients,
          authorId: repo.author.id,
        });

        setRecipeEquipmentList(equipmentIds);
        setRecipeIngredientList(formattedIngredients);
        console.log(repo.equipments);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRecipeDTO((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const formattedRecipe = {
      ...recipeDTO,
      image: imageSource,
      equipmentIds: recipeEquipmentList,
      ingredients: recipeIngredientList,
      time: recipeDTO.steps?.reduce((sum, step) => sum + step.time, 0) || 0,
    };

    const missingFields = [];
    if (!formattedRecipe.name) missingFields.push("Tên");
    if (!formattedRecipe.descriptions) missingFields.push("Mô tả");
    if (!formattedRecipe.steps) missingFields.push("Cần có ít nhất 1 bước");
    if (
      !formattedRecipe.ingredients ||
      formattedRecipe.ingredients.length === 0
    )
      missingFields.push("Cần có Nguyên Liệu");
    if (
      !formattedRecipe.equipmentIds ||
      formattedRecipe.equipmentIds.length === 0
    )
      missingFields.push("Cần có Công Cụ nấu ăn");

    if (missingFields.length > 0) {
      toast.error(`Bị thiếu: ${missingFields.join(", ")}`);
      return;
    }

    try {
      if (mode === "create") {
        const repo = await createRecipe(formattedRecipe as CreateRecipeDto);
        window.location.href = "/recipeDetails/" + repo?.id;
      } else if (mode === "edit" && recipe?.id) {
        await updateRecipe(recipe.id, formattedRecipe as UpdateRecipeDto);
        window.location.href = "/recipeDetails/" + recipe?.id;
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} recipe`,
        error,
      );
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImageUrl = event.target.value;
    setImageSource(newImageUrl);
    setRecipeDTO((prev) => ({ ...prev, image: newImageUrl }));
  };
  return (
    <div className="container mx-auto p-6 bg-base-200">
      <h3 className="font-bold text-lg mb-4">
        {mode === "edit" ? "Cập Nhật Công Thức" : "Tạo Mới Công Thức"}
      </h3>
      <div className="flex mb-6">
        <div className="w-1/2 pr-4">
          <PhotoProvider>
            <PhotoView src={imageSource}>
              <img
                src={imageSource}
                alt="Recipe"
                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400?text=H%C3%ACnh%20%E1%BA%A3nh%20m%C3%B3n%20%C4%83n%20c%E1%BB%A7a%20b%E1%BA%A1n";
                }}
              />
            </PhotoView>
          </PhotoProvider>
        </div>

        <div className="w-1/2 pl-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Chọn phương thức nhập hình ảnh</span>
            </label>
            <select
              value={inputMethod}
              onChange={(e) => setInputMethod(e.target.value as "file" | "url")}
              className="select select-bordered select-sm w-full bg-white"
            >
              <option value="url">Nhập URL</option>
              <option value="file">Tải lên từ máy</option>
            </select>
          </div>

          {inputMethod === "url" ? (
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">URL hình ảnh</span>
              </label>
              <input
                type="text"
                value={imageSource}
                onChange={handleImageChange}
                placeholder="Nhập URL hình ảnh"
                className="input input-bordered w-full bg-white"
              />
            </div>
          ) : (
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Hình ảnh</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const imageUrl = await upFileImg(file);
                      if (imageUrl) {
                        setImageSource(imageUrl);
                        setInputMethod("url");
                        setRecipeDTO((prev) => ({ ...prev, image: imageUrl }));
                      } else {
                        console.error(
                          "Error: No image URL returned from upFileImg",
                        );
                      }
                    } catch (error) {
                      console.error("Error uploading image:", error);
                    }
                  }
                }}
                className="file-input file-input-bordered w-full"
              />
            </div>
          )}

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Tên món ăn</span>
            </label>
            <input
              type="text"
              name="name"
              value={recipeDTO.name}
              onChange={handleInputChange}
              placeholder="Tên món ăn"
              className="input input-bordered w-full bg-white"
            />
          </div>

          <p className="mb-4">
            Thời gian tổng cộng:{" "}
            <span className="font-bold">
              {convertSecondsToHoursMinutesSeconds(
                recipeDTO.steps?.reduce((sum, step) => sum + step.time, 0) || 0,
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Mô tả món ăn</span>
        </label>
        <textarea
          name="descriptions"
          value={recipeDTO.descriptions}
          onChange={handleInputChange}
          placeholder="Mô tả món ăn"
          className="textarea textarea-bordered w-full bg-white"
        />
      </div>

      <SelectIngredients
        setRecipeIngredientList={setRecipeIngredientList}
        ingredientList={recipe?.ingredients}
      />

      <SelectEquipments
        setRecipeEquipmentList={setRecipeEquipmentList}
        equipmentList={recipe?.equipments}
      />

      <StepModal
        setStep={(updatedSteps: RecipeStepDto[]) =>
          setRecipeDTO((prev) => ({
            ...prev,
            steps: updatedSteps,
            time: updatedSteps.reduce((sum, step) => sum + step.time, 0),
          }))
        }
        stepList={recipeDTO.steps}
      />
      <div className="modal-action">
        <button className="btn btn-primary" onClick={handleSave}>
          {mode === "edit" ? (
            <>
              <IconFolders /> Lưu món ăn{" "}
            </>
          ) : (
            "Tạo Mới món ăn"
          )}
        </button>
      </div>
    </div>
  );
};

export default Recipe_Modify;
