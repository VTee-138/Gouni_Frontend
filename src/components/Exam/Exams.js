/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import Loading from "../Loading";
import ExamCard from "./ExamCard";
import { getExam } from "../../services/ExamService";
import { Stack } from "@mui/material";
import PaginationCustom from "../PaginationCustom";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const response = await getExam(page, 6, "A", "HSK1");
      if (response && response.data) {
        setExams(response.data || []);
        setTotalPages(response?.data?.totalPages || 0);
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
  }, [page]);

  const handleChangePage = (page) => {
    setPage(page);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  return (
    <div className="w-full space-y-8 pt-10">
      {loading && <Loading />}
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              Danh sách đề thi
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Khám phá và thực hành với các đề thi chất lượng cao
            </p>
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="space-y-8">
        {exams?.length === 0 && !loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500">Vui lòng thử lại với từ khóa khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 gap-6">
            {exams?.length > 0 &&
              exams?.map((item, index) => (
                <ExamCard key={item._id || index} item={item} />
              ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Exams;
