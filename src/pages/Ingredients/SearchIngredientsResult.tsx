import { IngredientCard } from "@/components/ingredients";
import { useDocumentTitle, useIngredients } from "@/hooks";
import { useEffect, useState } from "react";

const SearchIngredientsResult = () => {
  useDocumentTitle("Tìm kiếm Nguyên Liệu Nấu Ăn");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { getAllIngredients, ingredients, meta } = useIngredients(
    1,
    searchTerm,
  );

  const handleSearch = async (page = 1) => {
    await getAllIngredients(page, searchTerm);
    if (ingredients) {
      setCurrentPage(meta?.page || 1);
      const totalItems = meta?.total_items || 0;
      setTotalPages(Math.ceil(totalItems / 8));
    }
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
  };

  useEffect(() => {
    handleSearch(currentPage);
  }, [currentPage]);

  if (!ingredients) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="pl-48 pr-48 pt-4">
      <div className="join w-full place-content-center">
        <input
          className="input w-96 input-bordered join-item bg-white rounded-md"
          placeholder="Gõ vào tên các nguyên liệu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-accent join-item rounded-r-md"
          onClick={() => handleSearch(1)}
        >
          Tìm kiếm
        </button>
      </div>
      <div className="grid gap-6 grid-cols-4 mt-6 mb-12">
        {ingredients.map((ingredient) => (
          <IngredientCard
            id={ingredient.id}
            image={ingredient.image}
            key={ingredient.id}
            name={ingredient.name}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <div className="btn-group">
          <button
            className={`btn ${currentPage === 1 ? "btn-disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn ${currentPage === index + 1 ? "btn-active" : ""}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`btn ${currentPage === totalPages ? "btn-disabled" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchIngredientsResult;
