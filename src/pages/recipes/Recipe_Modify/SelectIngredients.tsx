import {
  CreateRecipeIngredientDto,
  IngredientDto,
  RecipeIngredientDto,
} from "@/client";
import useIngredients from "@/hooks/useIngredients.tsx";
import IngredientModal from "@/pages/recipes/ingredientModal/IngredientModal.tsx";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDebounce } from "use-debounce";

interface CustomSelectInputProps {
  setRecipeIngredientList: React.Dispatch<
    React.SetStateAction<CreateRecipeIngredientDto[]>
  >;
  ingredientList?: Array<RecipeIngredientDto>;
}

const SelectIngredients: React.FC<CustomSelectInputProps> = ({
  setRecipeIngredientList,
  ingredientList,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearchInput] = useDebounce(searchInput, 300); // Debounce for 300ms
  const { ingredients, updateIngredient, createIngredient } = useIngredients(
    1,
    debouncedSearchInput,
  ); // Fetch ingredients based on debounced input
  const [ingredientsList, setIngredientsList] = useState<RecipeIngredientDto[]>(
    ingredientList || [],
  );
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientDto | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (ingredientList) {
      setIngredientsList(ingredientList);
      setRecipeIngredientList(
        ingredientList.map((item) => ({
          ingredient_id: item.ingredient.id,
          quantity: item.quantity,
        })),
      );
    }
  }, [ingredientList, setRecipeIngredientList]);

  const handleAddIngredient = (selectedOption: IngredientDto | null) => {
    if (
      selectedOption &&
      !ingredientsList.some((item) => item.ingredient.id === selectedOption.id)
    ) {
      const newIngredient: RecipeIngredientDto = {
        ingredient: selectedOption,
        quantity: "",
      };
      setIngredientsList((prev) => [...prev, newIngredient]);
      setRecipeIngredientList((prev) => [
        ...prev,
        { ingredient_id: selectedOption.id, quantity: "" },
      ]);
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredientsList((prev) =>
      prev.filter((item) => item.ingredient.id !== id),
    );
    setRecipeIngredientList((prev) =>
      prev.filter((item) => item.ingredient_id !== id),
    );
  };
  const openModal = (ingredient: IngredientDto | null) => {
    setSelectedIngredient(ingredient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedIngredient(null);
    setModalOpen(false);
  };
  const handleUpdate = async (id: string, img: string, name: string) => {
    try {
      await updateIngredient({ name: name, image: img }, id);
      closeModal();
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  const handleCreate = async (img: string, name: string) => {
    try {
      const repo = await createIngredient({ name, image: img });
      if (repo) {
        handleAddIngredient(repo);
      }
      closeModal();
    } catch (error) {
      console.error("Error creating ingredient:", error);
    }
  };
  const handleQuantityChange = (id: string, quantity: string) => {
    setIngredientsList((prev) =>
      prev.map((item) =>
        item.ingredient.id === id ? { ...item, quantity } : item,
      ),
    );
    setRecipeIngredientList((prev) =>
      prev.map((item) =>
        item.ingredient_id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const options =
    ingredients?.map((ingredient) => ({
      value: ingredient.id,
      label: ingredient.name,
    })) || [];

  return (
    <>
      <div className="space-y-4 border p-4 bg-white rounded mt-8">
        <h3 className="text-lg font-semibold">Nguyên Liệu</h3>
        <div className="flex items-center space-x-4">
          <Select
            onChange={(option) => {
              const selectedIngredient = option
                ? ingredients?.find((ing) => ing.id === option.value)
                : null;
              if (selectedIngredient) {
                handleAddIngredient(selectedIngredient);
              }
            }}
            options={options}
            inputValue={searchInput}
            onInputChange={(inputValue) => setSearchInput(inputValue)}
            isClearable
            isSearchable
            placeholder="Chọn nguyên liệu"
            className="w-1/2"
          />
          <button
            className="btn btn-outline btn-info"
            onClick={() => openModal(null)}
          >
            <IconPlus />
            tạo Mới Nguyên Liệu Nấu Ăn
          </button>
        </div>

        <h4 className="font-medium">Danh sách nguyên liệu đã chọn:</h4>
        <ul className="space-y-2">
          {ingredientsList.map((item) => (
            <li
              key={item.ingredient.id}
              className="flex items-center space-x-2"
            >
              <span className="input input-bordered input-sm w-2/12 text-center">
                {item.ingredient.name}
              </span>
              <input
                type="text"
                value={item.quantity}
                placeholder="Số Lượng"
                className="input input-bordered input-sm w-1/2 max-w-xs"
                onChange={(e) =>
                  handleQuantityChange(item.ingredient.id, e.target.value)
                }
              />
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => handleRemoveIngredient(item.ingredient.id)}
              >
                <IconTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <IngredientModal
        isOpen={isModalOpen}
        ingredient={selectedIngredient}
        onClose={closeModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
      />
    </>
  );
};

export default SelectIngredients;
