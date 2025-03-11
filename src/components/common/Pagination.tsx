interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let leftBound = Math.max(2, currentPage - 1);
      let rightBound = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        rightBound = Math.min(5, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        leftBound = Math.max(totalPages - 4, 2);
      }

      if (leftBound > 2) {
        pageNumbers.push("...");
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages - 1) {
        pageNumbers.push("...");
      }

      if (rightBound !== totalPages) {
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };
  const pageNumbers = generatePageNumbers();
  return (
    <div className="flex justify-center">
      <div className="join">
        <button
          className="join-item btn btn-sm bg-base-100"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          «
        </button>
        {pageNumbers.map((page, index) =>
          typeof page === "string" ? (
            <button key={index} className="join-item btn btn-sm ">
              ...
            </button>
          ) : (
            <button
              key={index}
              className={`join-item btn btn-sm ${page === currentPage ? "btn-neutral" : "bg-base-100 "}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
        <button
          className="join-item btn-sm btn bg-base-100 "
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
