import { SearchBar } from "@/components/common";
import { IngredientOption } from "@/components/ingredients/FilterIngredient.tsx"; // Assuming you have a type definition for IngredientOption
import { FilterIngredient } from "@/components/ingredients/index.ts";
import { SEARCH_KEYS } from "@/constants";
import { useDocumentTitle, useRecipes, useSearchSuggestions } from "@/hooks";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { RecipePagination } from ".";

const RecipesSearch: React.FC = () => {
  useDocumentTitle("Tìm kiếm công thức - Cơm Nhà");

  const location = useLocation();

  const {
    recipes,
    recipeInforAll,
    fetchRecipes,
    searchRecipes,
    setPage,
    page,
  } = useRecipes();

  const [searchTerm, setSearchTerm] = useState<string>(
    new URLSearchParams(location.search).get("query") || "",
  );
  const [displayedSearchTerm, setDisplayedSearchTerm] =
    useState<string>(searchTerm);

  const [ingredientIds, setIngredientIds] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientOption[]
  >([]);

  const { suggestions, fetchSuggestions, loading } = useSearchSuggestions();

  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    searchRecipes({
      page: 1,
      q: searchTerm,
      ingredientIds: ingredientIds,
      perPage: 8,
    });
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsDebouncing(true);
    const lastQuery = debouncedSearchTerm.split(",").pop()?.trim() || "";

    setDisplayedSearchTerm(debouncedSearchTerm);
    fetchSuggestions({ q: lastQuery }).finally(() => {
      setIsDebouncing(false);
    });
  }, [debouncedSearchTerm, fetchSuggestions]);

  useEffect(() => {
    fetchRecipesOnPageChange();
  }, [page]);

  const handleSuggestionClick = (suggestion: string) => {
    const lastCommaIndex = searchTerm.lastIndexOf(",");
    if (lastCommaIndex !== -1) {
      setSearchTerm(
        searchTerm.substring(0, lastCommaIndex + 1) + " " + suggestion,
      );
    } else {
      setSearchTerm(suggestion);
    }

    handleSearch();
  };

  const fetchMoreItems = async () => {
    if (recipeInforAll?.meta?.has_next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchRecipesOnPageChange = async () => {
    if (page > 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchRecipes(page, searchTerm, ingredientIds);
    }
  };

  const handleSelectedIngredientsChange = async (
    selectedOptions: IngredientOption[],
  ) => {
    const ids: string[] = selectedOptions.map((option) =>
      option.value.toString(),
    );
    setIngredientIds(ids);
    setSelectedIngredients(selectedOptions);
    await searchRecipes({
      page: 1,
      q: searchTerm,
      ingredientIds: ingredientIds,
      perPage: 8,
    });
  };

  const handleSearch = async () => {
    await searchRecipes({
      page: 1,
      q: searchTerm,
      ingredientIds: ingredientIds,
      perPage: 8,
    });
  };

  const getLastElement = (input: string): string =>
    input.split(",").pop()?.trim() ?? input.trim();

  if (!recipes) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex flex-grow px-32">
        <div className="w-2/3 p-4 ml-8">
          <div className="join w-full place-content-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSubmitSearch={handleSearch}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              isSuggestionsLoading={isDebouncing || loading}
              placeholder="Nhập nguyên liệu: Thịt bò, cá, rau..."
              storageKey={SEARCH_KEYS.RECIPES}
            />
          </div>
          <RecipePagination
            searchTerm={displayedSearchTerm}
            recipes={recipes}
            totalItem={recipeInforAll?.meta?.total_items || 0}
            fetchMore={fetchMoreItems}
            hasMore={recipeInforAll?.meta?.has_next || false}
          />
        </div>

        <div className="w-1/3 p-4 h-screen sticky top-[4em]">
          <FilterIngredient
            onSelectionChange={handleSelectedIngredientsChange}
            selectedIngredients={selectedIngredients}
            keyword={getLastElement(displayedSearchTerm)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipesSearch;
