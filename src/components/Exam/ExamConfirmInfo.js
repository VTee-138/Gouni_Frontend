import React, { useEffect, useState } from "react";

import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { getExamDetail } from "../../services/ExamService";
import Loading from "../Loading";
import {
  Clock,
  User,
  FileText,
  ListChecks,
  PlayCircle,
  ArrowLeft,
  Info,
} from "lucide-react";
import { getUserInfo } from "../../services/AuthService";

const ExamConfirmInfo = () => {
  const [searchParams] = useSearchParams();
  const examRoomId = searchParams.get("examRoomId");
  const { id } = useParams();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFetch = async () => {
    try {
      setLoading(true);
      const responseExam = await getExamDetail(id, examRoomId);
      const examData = responseExam?.data;
      if (examData) {
        setExamData(examData);
      }
    } catch (error) {
      console.log(" handleFetch ~ error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
      navigate(`/courses/${error?.response?.data?.courseId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, [id, examRoomId]);

  if (loading) {
    return <Loading />;
  }
  const handleNameExam = (type) => {
    switch (type) {
      case "TSA":
        return {
          schoolName: "ĐẠI HỌC BÁCH KHOA HÀ NỘI",
          examName: "BÀI THI ĐÁNH GIÁ TƯ DUY",
        };
      case "HSA":
        return {
          schoolName: "ĐẠI HỌC QUỐC GIA HÀ NỘI",
          examName: "BÀI THI ĐÁNH GIÁ NĂNG LỰC",
        };
      case "APT":
      case "V-ACT":
      case "VACT":
        return {
          schoolName: "ĐẠI HỌC QUỐC GIA HỐ CHÍ MINH",
          examName: "BÀI THI ĐÁNH GIÁ NĂNG LỰC",
        };
      case "THPT":
        return {
          schoolName: "BỘ GIÁO DỤC VÀ ĐÀO TẠO",
          examName: "BÀI THI TỐT NGHIỆP THPT QUỐC GIA",
        };
      default:
        return {
          schoolName: "86HSK EDU - CHINH PHỤC KỲ THI HSA / TSA",
          examName: "BÀI THI THỬ CHUYÊN BIỆT",
        };
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbeeee] relative overflow-hidden px-2">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <g opacity="0.15">
            <rect x="0" y="0" width="1920" height="900" fill="#fff" />
            <circle cx="1600" cy="700" r="400" fill="#fff" />
            <circle cx="200" cy="200" r="300" fill="#fff" />
            <rect x="0" y="0" width="1920" height="900" fill="url(#grid)" />
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="2" height="2" fill="#e5bfc2" />
              </pattern>
            </defs>
          </g>
        </svg>
      </div>
      {/* Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl px-3 py-5 sm:px-6 sm:py-8 md:px-12 md:py-10 w-full max-w-[95vw] sm:max-w-md md:max-w-lg flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4 text-center w-full">
          <span className="text-4xl sm:text-5xl font-bold text-[#d8232a] leading-none tracking-tight">
            {examData?.type}
          </span>
          <span className="text-xs font-semibold text-[#d8232a] mt-1">
            {handleNameExam(examData?.type)?.schoolName}
          </span>
          <span className="text-lg sm:text-xl font-bold text-black mt-1">
            {handleNameExam(examData?.type)?.examName}
          </span>
        </div>
        {/* Title */}
        <div className="text-xl sm:text-2xl font-medium text-center mb-6 mt-2 w-full">
          Xác nhận thông tin dự thi
        </div>
        {/* Info */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="flex flex-row w-full items-center text-[15px] sm:text-base">
            <div className="min-w-[90px] text-left text-gray-600 flex items-center gap-1 whitespace-nowrap">
              <User size={16} className="mr-1" /> Họ tên
            </div>
            <div className="flex-1 text-left font-medium text-gray-800 pl-2 truncate">
              {getUserInfo()?.username || "Vô danh"}
            </div>
          </div>
          <div className="flex flex-row w-full items-center text-[15px] sm:text-base">
            <div className="min-w-[90px] text-left text-gray-600 flex items-center gap-1 whitespace-nowrap">
              <FileText size={16} className="mr-1" /> Kip thi
            </div>
            <div className="flex-1 text-left font-medium text-gray-800 pl-2 truncate">
              {examData?.title?.text}
            </div>
          </div>
          <div className="flex flex-row w-full items-center text-[15px] sm:text-base">
            <div className="min-w-[90px] text-left text-gray-600 flex items-center gap-1 whitespace-nowrap">
              <Clock size={16} className="mr-1" /> Thời gian làm bài
            </div>
            <div className="flex-1 text-left font-medium text-gray-800 pl-2 truncate">
              {examData?.time} phút
            </div>
          </div>
          <div className="flex flex-row w-full items-center text-[15px] sm:text-base">
            <div className="min-w-[90px] text-left text-gray-600 flex items-center gap-1 whitespace-nowrap">
              <ListChecks size={16} className="mr-1" /> Số lượng câu hỏi
            </div>
            <div className="flex-1 text-left font-medium text-gray-800 pl-2 truncate">
              {examData?.numberOfQuestions} câu
            </div>
          </div>
        </div>
        {/* Note */}
        <div className="w-full italic text-left text-[15px] sm:text-[17px] text-gray-700 mb-6">
          Lưu ý: Bằng việc nhấn nút <b>"Bắt đầu thi"</b> hệ thống sẽ bắt đầu
          tính giờ cho bài thi của bạn
        </div>
        {/* Button */}
        <button
          onClick={() =>
            navigate(`/exam/test/${examData?._id}?examRoomId=${examRoomId}`)
          }
          className="w-full bg-[#d8232a] hover:bg-[#b71c1c] text-white text-lg font-medium rounded-md py-3 mb-3 transition-colors duration-150 flex items-center justify-center gap-2"
        >
          <PlayCircle size={20} /> Bắt đầu thi
        </button>
        {/* Links */}
        <div className="w-full flex flex-row justify-between items-center gap-2 mt-1 text-center text-nowrap">
          <Link
            to={`/exam-rooms/${examRoomId}`}
            className="text-[#d8232a]  text-lg flex items-center gap-1 justify-center"
          >
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <a
            href="#"
            className="text-[#d8232a]  text-lg flex items-center gap-1 justify-center"
          >
            <Info size={16} /> Hướng dẫn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExamConfirmInfo;
