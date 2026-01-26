"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  Users,
  Search,
  ChevronDown,
} from "lucide-react";
import Loading from "../Loading";
import ExamCard from "./ExamCard";
import { getExamByExamRoomId } from "../../services/ExamService";
import { Stack, Typography } from "@mui/material";
import PaginationCustom from "../PaginationCustom";

const Exams = () => {
  const location = useLocation();
  const { examRoomId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const type = queryParams.get("type");
  const [examRoomData, setExamRoomData] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState([]);
  const [totalExams, setTotalExams] = useState(0);
  const [totalNumberOfTest, setTotalNumberOfTest] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [courseId, setCourseId] = useState("");
  const [examType, setExamType] = useState("EXAM"); // "EXAM" hoặc "TEST"
  const category = queryParams.get("category") || "EXAM_ROOM";

  const handleFetch = async () => {
    try {
      setLoading(true);
      const response = await getExamByExamRoomId(
        page,
        type || "",
        6,
        examRoomId,
        searchValue,
        examType
      );
      if (response && response.data) {
        setExamRoomData(response.data);
        setTotalPages(response?.totalPages);
        setTotalExams(response?.totalExams);
        setTotalNumberOfTest(response?.totalNumberOfTest);
        setCourseId(response?.courseId);
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [page, type, examRoomId, category, examType]);

  const handleChangePage = (page) => {
    setPage(page);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleFetchWithSearch = async (search) => {
    try {
      setLoading(true);
      // Gọi API với search (giả sử getExamByExamRoomId có hỗ trợ query q)
      const response = await getExamByExamRoomId(
        1,
        type || "",
        6,
        examRoomId,
        search,
        examType
      );

      if (response && response.data) {
        setExamRoomData(response.data);
        setTotalPages(response?.totalPages);
        setTotalExams(response?.totalExams);
        setTotalNumberOfTest(response?.totalNumberOfTest);
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    handleFetchWithSearch(searchValue);
  };

  const handleExamTypeChange = (newType) => {
    setExamType(newType);
    setPage(1); // Reset về trang 1 khi thay đổi loại
  };

  // if (loading) return <Loading />;

  return (
    <div className="w-full space-y-8">
      {loading && <Loading />}
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
              <BookOpen className="text-blue-600" size={32} />
              {examType === "EXAM" ? "Danh sách đề thi" : "Danh sách bài tập"}
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Khám phá và thực hành với các đề thi chất lượng cao
            </p>

            {/* Type Selector */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-medium text-gray-700">Loại:</span>
              <div className="relative">
                <select
                  value={examType}
                  onChange={(e) => handleExamTypeChange(e.target.value)}
                  className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:border-gray-300"
                >
                  <option value="EXAM">📝 Đề thi</option>
                  <option value="TEST">📚 Bài tập</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative flex items-center max-w-2xl mx-auto">
            <div className="relative w-full">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full pl-12 pr-32 py-3 rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm shadow-lg transition-all duration-300 hover:shadow-xl"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />

              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>

              {/* Search Button Inside */}
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1.5"
              >
                <span>Tìm kiếm</span>
                <Search size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {examType === "EXAM" ? "Tổng đề thi" : "Tổng bài tập"}
                </p>
                <p className="text-xl font-bold text-gray-800">{totalExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã tham gia</p>
                <p className="text-xl font-bold text-gray-800">
                  {totalNumberOfTest}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Exam Cards Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {examRoomData?.examIds?.length > 0 &&
            examRoomData?.examIds?.map((item, index) => (
              <ExamCard
                key={item._id || index}
                item={item}
                examRoomId={examRoomId}
                courseId={courseId}
              />
            ))}
        </div>
      </div>

      {examRoomData?.examIds?.length > 0 ? (
        <Stack
          sx={{
            width: "100%",
            margin: "0 auto",
          }}
          alignItems={"center"}
          justifyContent={"center"}
          className="mt-[30px]"
        >
          <PaginationCustom
            totalPage={totalPages}
            currentPage={page}
            handleChangePage={handleChangePage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          ></PaginationCustom>
        </Stack>
      ) : (
        <Typography fontSize={"20px"} fontWeight={"500"} textAlign={"center"}>
          Không có dữ liệu
        </Typography>
      )}
    </div>
  );
};

export default Exams;
