import { SearchBar } from "@/components/common";
import { RecipeCard } from "@/components/recipes";
import { SEARCH_KEYS } from "@/constants";
import {
  useBanners,
  useDocumentTitle,
  useIngredients,
  useRecipes,
  useSearchSuggestions
} from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { IngredientCard } from "./home/index.ts";

const HomePage = () => {
  useDocumentTitle("Cơm Nhà - Nấu ăn ngon mỗi ngày");

  const navigate = useNavigate();

  const { recipes, searchRecipes } = useRecipes();
  const { ingredients, findTopIngredients } = useIngredients(1, "");

  const { suggestions, fetchSuggestions, loading } = useSearchSuggestions();
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { banners, fetchBanners } = useBanners();

  const scrollToItem = (index: number) => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollAmount = carousel.offsetWidth * index;
      carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
    setCurrentIndex(index);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % banners.length;
    scrollToItem(nextIndex);
  };

  useEffect(() => {
    searchRecipes({ page: 1, q: searchTerm, perPage: 8 });
    fetchBanners();

    findTopIngredients({ page: 1, per_page: 8 });
  }, []);

  useEffect(() => {
    setIsDebouncing(true);
    const lastQuery = debouncedSearchTerm.split(",").pop()?.trim() || "";

    fetchSuggestions({ q: lastQuery }).finally(() => {
      setIsDebouncing(false);
    });
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handleSearch = () => {
    navigate(`/search/recipes?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const lastCommaIndex = searchTerm.lastIndexOf(",");
    if (lastCommaIndex !== -1) {
      setSearchTerm(
        searchTerm.substring(0, lastCommaIndex + 1) + " " + suggestion
      );
    } else {
      setSearchTerm(suggestion);
    }
  };

  const handleIngredientCardClick = (ingredient: string) => {
    navigate(`/search/recipes?query=${encodeURIComponent(ingredient)}`);
  };

  const handleManualChange = (index: number) => {
    scrollToItem(index);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHovered) return;
      nextImage()
    }, 5000);

    return () => clearInterval(interval)
  }, [currentIndex, banners.length,isHovered])
  return (
    <>
      <section className="hero w-[72em] mx-auto p-3 bg-white rounded-lg flex flex-col items-center justify-center">
        <div className="w-[68em]">
          <img
            src="https://static.naucomnha.com/images/8877db0c-fd05-4415-9c8d-a146bd5f93be.png"
            className="w-28 mx-auto"
            alt=""
          />
          <div className="w-1/2 mx-auto mt-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSubmitSearch={handleSearch}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              isSuggestionsLoading={isDebouncing || loading}
              placeholder={
                "Tủ lạnh nhà bạn đang có nguyên liệu gì ?"
              }
              storageKey={SEARCH_KEYS.RECIPES}
            />
          </div>

          <div className="mx-[4em] mt-6">
            <div
              className="carousel w-full flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
              ref={carouselRef}
            >
              {banners.map((banner, idx) => (
                <div
                  key={idx}
                  className="carousel-item w-full snap-start flex justify-center items-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <a
                    href={banner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={banner.image} alt={`${banner.name}`} className="w-full h-48 object-cover rounded-lg" />
                  </a>
                </div>
              ))}
            </div>

            <div className="flex w-full justify-center gap-2 mt-3 h-0">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  className={`rounded-full transition-all duration-300 hover:w-2.5 hover:h-2.5 ${
                    currentIndex === idx
                      ? "bg-orange-400 w-2.5 h-2.5"
                      : "bg-gray-300 w-2 h-2"
                  }`}
                  onClick={() => handleManualChange(idx)}
                />
              ))}
            </div>
          </div>


          <div className="mx-[4em] mt-12">
            <p className="font-bold text-xl mb-4">
              Nguyên liệu được dùng nhiều nhất
            </p>
            <div className="grid grid-cols-4 gap-3">
              {ingredients &&
                ingredients.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    name={ingredient.name}
                    image={ingredient.image}
                    onClick={() => handleIngredientCardClick(ingredient.name)}
                  />
                ))}
            </div>
          </div>

          <div className="mx-[4em] mt-12">
            <p className="font-bold text-xl my-4">Công thức nổi bật</p>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {recipes.slice(0, 4).map((recipe) => (
                <RecipeCard
                  id={recipe.id}
                  image={recipe.image}
                  key={recipe.id}
                  name={recipe.name}
                  author={recipe.author}
                  className="w-56"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-base-100 mt-3">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Tại sao chọn Cơm Nhà?
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Đa dạng công thức</h3>
                <p>
                  Hàng ngàn công thức từ đơn giản đến phức tạp, phù hợp với mọi
                  trình độ nấu ăn.
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Cộng đồng sôi nổi</h3>
                <p>
                  Chia sẻ và học hỏi từ cộng đồng đam mê ẩm thực lớn nhất Việt
                  Nam.
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Tiện lợi mọi lúc</h3>
                <p>Truy cập mọi nơi, mọi lúc với ứng dụng di động tiện lợi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
