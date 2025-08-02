import Header from "../Header/Header";
import { Zap, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import Exams from "./Exams";
import { Link, useParams } from "react-router-dom";
import { getExamTrend } from "../../services/ExamService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import ExamConfirmInfo from "./ExamConfirmInfo";
import Footer from "../Footer/Footer";

const ExamPage = () => {
  const { examRoomId } = useParams();
  const [examsData, setExamsData] = useState([]);

  const handleFetch = async () => {
    try {
      const response = await getExamTrend(1, "", 6, examRoomId);
      if (response && response.data) {
        setExamsData(response.data);
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [examRoomId]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />

        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-8 py-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 xl:w-3/4">
              <Exams />
            </div>

            {/* Enhanced Sidebar */}
            <div className="xl:w-1/4 space-y-6">
              {/* Trending Exams Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6">
                {/* Header Section */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-red-400 to-red-500 rounded-xl shadow-lg">
                    <Zap className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Đề thi thịnh hành
                  </h2>
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                  {examsData.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="text-red-500" size={24} />
                      </div>
                      <p className="text-gray-600 font-medium mb-1">
                        Chưa có dữ liệu
                      </p>
                      <p className="text-sm text-gray-400">
                        Nội dung sẽ được cập nhật sớm
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {examsData.map((exam, idx) => (
                        <Link
                          key={exam._id}
                          to={`/exam/test/${exam?._id}?examRoomId=${examRoomId}`}
                          className="block group"
                        >
                          <Tooltip title={exam.title?.text} placement="top">
                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-md">
                              {/* Ranking Number */}
                              <div
                                className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white shadow-sm flex-shrink-0
                ${"bg-gradient-to-r from-red-300 to-red-400"}
              `}
                              >
                                {idx + 1}
                              </div>

                              {/* Exam Image */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={
                                    exam.imgUrl ||
                                    "https://res.cloudinary.com/tuanpham/image/upload/v1748930669/ugz0qqkg2ad1y0bsyxeb.jpg"
                                  }
                                  alt={exam.title?.text}
                                  className="w-12 h-12 object-cover rounded-lg border-2 border-gray-100 group-hover:border-orange-200 transition-colors duration-200"
                                />
                                {/* Trending Badge */}
                                {exam?.numberOfTest > 100 && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <TrendingUp
                                      size={8}
                                      className="text-white"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Content - Fix layout */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate text-sm group-hover:text-orange-600 transition-colors duration-200 mb-1">
                                  {exam.title?.text}
                                </h3>

                                {/* Stats Row - Fix alignment */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <TrendingUp
                                      size={10}
                                      className="text-orange-400 flex-shrink-0"
                                    />
                                    <span className="font-medium whitespace-nowrap">
                                      {exam.numberOfTest || 0} lượt thi
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Arrow Icon */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                                <ArrowRight
                                  size={16}
                                  className="text-gray-400 group-hover:text-orange-500"
                                />
                              </div>
                            </div>
                          </Tooltip>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Card
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={20} />
                  Thống kê nhanh
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">
                      Tổng đề thi
                    </span>
                    <span className="text-lg font-bold text-blue-600">150+</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">
                      Học viên tham gia
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      2.5K+
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">
                      Lượt thi hôm nay
                    </span>
                    <span className="text-lg font-bold text-purple-600">89</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default ExamPage;
