import { useSearchSuggestions } from "@/hooks";
import useIngredients from "@/hooks/useIngredients.tsx";
import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { useDebounce } from "use-debounce";

export interface IngredientOption {
  value: string;
  label: string;
}

interface FilterIngredientProps {
  onSelectionChange: (selected: IngredientOption[]) => void; // Callback for selection change
  selectedIngredients: IngredientOption[]; // Currently selected ingredients
  keyword: string;
}

const animatedComponents = makeAnimated();

const FilterIngredient: React.FC<FilterIngredientProps> = ({
  onSelectionChange,
  selectedIngredients,
  keyword,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { ingredients, getAllIngredients } = useIngredients(1, "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const { suggestions, fetchSuggestions } = useSearchSuggestions();

  useEffect(() => {
    fetchSuggestions({ q: keyword });
  }, [keyword]);

  const handleInputChange = (newValue: string) => {
    setSearchTerm(newValue);
  };

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      getAllIngredients(1, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleChange = (selected: MultiValue<IngredientOption>) => {
    // Convert MultiValue to a regular array
    const selectedArray = Array.isArray(selected) ? selected : [];
    onSelectionChange(selectedArray);
  };

  const options: IngredientOption[] =
    ingredients?.map((ingredient) => ({
      value: ingredient.id,
      label: ingredient.name,
    })) || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-auto w-full max-w-4xl">
      <h2 className="font-semibold text-lg mb-4">Từ khoá tương tự</h2>
      <p>
        {keyword
          ? suggestions.map((suggestion, index) => (
              <span key={index} className="badge badge-xl p-3 mb-1 mr-1">
                {suggestion}
              </span>
            ))
          : "Tìm kiếm để bắt đầu"}
      </p>

      <div className="divider"></div>

      <h2 className="font-semibold text-lg mb-4">Sàng lọc</h2>
      <div>
        <p className="mb-2">Công thức tôi muốn sẽ bao gồm:</p>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          value={selectedIngredients}
          isMulti
          options={options}
          placeholder="Tìm kiếm và chọn nguyên liệu..."
          onInputChange={handleInputChange}
          onChange={handleChange}
          inputValue={searchTerm}
          className="w-full"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "38px",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 2,
            }),
          }}
        />
      </div>
    </div>
  );
};

export default FilterIngredient;
