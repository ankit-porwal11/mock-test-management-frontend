import { useState, useMemo } from 'react';

/**
 * Pagination logic hook.
 *
 * @param {number} totalItems   - Total number of items in the dataset.
 * @param {number} itemsPerPage - Number of items shown per page (default: 9).
 * @returns {{
 *   currentPage: number,
 *   totalPages: number,
 *   nextPage: Function,
 *   prevPage: Function,
 *   goToPage: Function,
 *   startIndex: number,
 *   endIndex: number,
 * }}
 */
const usePagination = (totalItems, itemsPerPage = 9) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
  };
};

export default usePagination;
