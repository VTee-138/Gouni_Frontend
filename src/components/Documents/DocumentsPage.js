import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Stack, Typography } from "@mui/material";
import PaginationCustom from "../PaginationCustom";
import Loading from "../Loading";
import { getCategories } from "../../services/CategoryService";
import { getDocuments } from "../../services/DocumentService";
import DocumentCard from "./DocumentCard";
import { Files, Menu, X, Search } from "lucide-react";
import Footer from "../Footer/Footer";
import { getUserInfo } from "../../services/AuthService";

export default function DocumentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const sort = queryParams.get("sort") || "createdAt";
  const order = queryParams.get("order") || "desc";
  const [searchValue, setSearchValue] = useState(query);

  // Update searchValue when query parameter changes
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  // Fetch documents
  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getDocuments(
          page,
          6,
          query,
          sort,
          order,
          true,
          getUserInfo()?.id
        );
        console.log(" handleFetch ~ response:", response);
        if (response && response?.data) {
          setDocumentsData(response?.data);
          setTotalPages(response?.totalPages);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, [page, query, sort, order]);

  // Fetch categories
  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getCategories("", "", "DOCUMENT");
        if (response && response?.data) {
          setCategories([{ title: "Tất cả", type: "ALL" }, ...response?.data]);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, []);

  // Pagination handlers
  const handleChangePage = (page) => {
    setPage(page);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  // URL update function
  const updateURL = (newSort, newOrder) => {
    setPage(1);
    const params = new URLSearchParams(location.search);
    if (newSort) params.set("sort", newSort);
    if (newOrder) params.set("order", newOrder);
    navigate({ pathname: "/documents", search: params.toString() });
  };

  // Sort handlers
  const handleSortNewest = () => updateURL("createdAt", "desc");
  const handleSortDownloadAsc = () => updateURL("numberOfDơwnload", "asc");
  const handleSortDownloadDesc = () => updateURL("numberOfDơwnload", "desc");

  // Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar when clicking category on mobile
  const handleCategoryClick = (categoryType) => {
    setPage(1);
    setIsSidebarOpen(false);
  };

  // Search handlers
  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams(location.search);
    if (searchValue.trim()) {
      params.set("query", searchValue.trim());
    } else {
      params.delete("query");
    }
    navigate({ pathname: "/documents", search: params.toString() });
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setPage(1);
    const params = new URLSearchParams(location.search);
    params.delete("query");
    navigate({ pathname: "/documents", search: params.toString() });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Tài liệu</span>
        </div>

        {/* Header với Mobile Menu Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Thư viện tài liệu
            </h1>
            <p className="text-gray-600">Khám phá kho tài liệu học tập phong phú</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Menu size={20} />
            <span className="hidden sm:inline">Lọc</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
    bg-white shadow-xl lg:rounded-2xl p-6 border border-gray-100
    fixed lg:static top-20 lg:top-0 left-0 bottom-0 lg:inset-y-0 z-50 w-80 lg:w-auto
    transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    overflow-y-auto lg:max-h-none
  `}
          >
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Danh mục</h2>
              <button
                onClick={closeSidebar}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Desktop Header */}
            <h2 className="hidden lg:block text-xl font-bold text-gray-800 mb-6 tracking-wide">
              Danh mục tài liệu
            </h2>

            {/* Categories List */}
            <ul className="space-y-1">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={`/documents?query=${category?.type}`}
                    onClick={() => handleCategoryClick(category?.type)}
                    className={`
                      flex items-center gap-2 px-3 py-3 rounded-lg transition-all duration-200
                      text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600
                      font-medium hover:shadow-md
                      ${
                        window.location.search.includes(category?.type)
                          ? "bg-red-100 font-bold text-red-700"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Files size={16} className="flex-shrink-0 mt-[2px]" />
                      <span className="text-[15px] flex-1 leading-5">
                        {category?.title}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
              {/* Sort Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Tất cả tài liệu
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <button
                    className="text-sm text-gray-600 hover:text-red-600 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                    onClick={handleSortNewest}
                  >
                    Mới nhất
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:text-red-600 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                    onClick={handleSortDownloadAsc}
                  >
                    Lượt tải tăng dần
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:text-red-600 hover:underline px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                    onClick={handleSortDownloadDesc}
                  >
                    Lượt tải giảm dần
                  </button>
                </div>
              </div>

              {/* Search Section */}
              <div className="mt-3">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchValue}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 text-sm transition-all duration-300"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Tìm
                  </button>

                  {/* Clear Button (shown when there's search value) */}
                  {searchValue && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Xóa tìm kiếm"
                    >
                      <X size={16} className="mr-5" />
                    </button>
                  )}
                </div>

                {/* Search Result Info */}
                {query && (
                  <div className="mt-2 text-sm text-gray-600">
                    Kết quả tìm kiếm cho:{" "}
                    <span className="font-semibold text-red-600">
                      "{query}"
                    </span>
                    <button
                      onClick={clearSearch}
                      className="ml-2 text-red-600 hover:text-red-700 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loading />
              </div>
            ) : (
              <>
                {/* Document Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {documentsData.map((document) => (
                    <div
                      key={document.id}
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      <DocumentCard {...document} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {documentsData?.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <Stack
                      sx={{ width: "100%", margin: "0 auto" }}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <PaginationCustom
                        totalPage={totalPages}
                        currentPage={page}
                        handleChangePage={handleChangePage}
                        handleNextPage={handleNextPage}
                        handlePrevPage={handlePrevPage}
                      />
                    </Stack>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <Files size={64} className="mx-auto" />
                    </div>
                    <Typography
                      fontSize={"20px"}
                      fontWeight={"500"}
                      color="text.secondary"
                    >
                      Không có tài liệu nào được tìm thấy
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      color="text.secondary"
                      className="mt-2"
                    >
                      Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                    </Typography>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
