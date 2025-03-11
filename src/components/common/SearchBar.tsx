import { IconClockFilled, IconSearch, IconX } from "@tabler/icons-react";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (newSearchTerm: string) => void;
  onSubmitSearch: (searchTerm: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isSuggestionsLoading: boolean;
  placeholder?: string;
  storageKey?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      searchTerm,
      onSearchTermChange,
      onSubmitSearch,
      suggestions,
      onSuggestionClick,
      isSuggestionsLoading,
      placeholder = "Tìm kiếm...",
      storageKey,
    },
    ref,
  ) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isShowSuggestions, setIsShowSuggestions] = useState(true);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
      if (storageKey) {
        const storedHistory = localStorage.getItem(storageKey);
        if (storedHistory) {
          setSearchHistory(JSON.parse(storedHistory));
        }
      }
    }, [storageKey]);

    const saveSearchHistory = (newSearchTerm: string) => {
      if (storageKey && newSearchTerm) {
        const updatedHistory = [
          newSearchTerm,
          ...searchHistory.filter((item) => item !== newSearchTerm),
        ].slice(0, 10);
        setSearchHistory(updatedHistory);
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      }
    };

    const removeHistoryItem = (itemToRemove: string) => {
      if (storageKey) {
        const updatedHistory = searchHistory.filter(
          (item) => item !== itemToRemove,
        );
        setSearchHistory(updatedHistory);
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchTermChange(e.target.value);
      setIsShowSuggestions(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handlePerformSearch();
      }
    };

    const handlePerformSearch = () => {
      onSubmitSearch(searchTerm);
      saveSearchHistory(searchTerm);
      setIsShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
      onSuggestionClick(suggestion);
    };

    const combinedSuggestions = Array.from(
      new Set([
        ...searchHistory.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
        ...suggestions,
      ]),
    );

    return (
      <div className="flex w-full">
        <div className="dropdown w-full relative" ref={dropdownRef}>
          <input
            type="text"
            className="input input-bordered rounded-lg w-full bg-white"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={ref}
          />

          <div className="dropdown-content menu p-2 shadow rounded-lg w-full mt-1 z-50 absolute bg-white">
            {combinedSuggestions.length > 0 && isShowSuggestions && (
              <>
                {combinedSuggestions.slice(0, 10).map((suggestion, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="hover:bg-gray-100 px-4 py-2 rounded-md flex items-center w-full"
                    >
                      {searchHistory.includes(suggestion) ? (
                        <IconClockFilled className="w-4 h-4 mr-1" />
                      ) : (
                        <IconSearch className="w-4 h-4 mr-1" />
                      )}
                      <p>{suggestion}</p>
                      {searchHistory.includes(suggestion) && (
                        <span className="btn btn-sm btn-square btn-ghost ml-auto">
                          <IconX
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              removeHistoryItem(suggestion);
                            }}
                            className="w-3 h-3"
                          />
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </>
            )}

            {isSuggestionsLoading && isShowSuggestions && (
              <li className="flex justify-center items-center py-2">
                <SyncLoader size={8} color="#4B5563" />
              </li>
            )}
          </div>
        </div>
        <button
          onClick={handlePerformSearch}
          className="btn btn-accent ml-3 rounded-lg"
        >
          Tìm kiếm
        </button>
      </div>
    );
  },
);

export default SearchBar;
