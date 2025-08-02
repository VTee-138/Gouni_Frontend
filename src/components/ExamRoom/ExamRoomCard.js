import React from "react";
import hsa_img from "../../images/KHOAHOCHSA.jpg";
import tsa_img from "../../images/thi-tsa.png";
import { Link } from "react-router-dom";
import { BookOpen, FileQuestion, Users, Clock } from "lucide-react";

export default function ExamRoomCard({
  _id,
  title,
  type,
  imgUrl,
  access,
  totalExam,
  totalQuestion,
  examIds,
  category,
}) {
  const countExam =
    examIds?.filter((exam) => exam?.typeOfExam === "EXAM")?.length || 0;
  const countTest =
    examIds?.filter((exam) => exam?.typeOfExam === "TEST")?.length || 0;

  return (
    <Link to={`/exam-rooms/${_id}`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full transform group-hover:scale-[1.02] border border-gray-100 flex flex-col">
        {/* Image Container - Cải thiện aspect ratio */}
        <div className="relative overflow-hidden h-32 flex-shrink-0">
          <img
            src={imgUrl || hsa_img}
            alt={title?.code}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>

          {/* Type Badge - Thiết kế hiện đại */}
          <div className="absolute top-2 left-2 z-10">
            <div className="flex items-center gap-1 bg-red-500 text-white font-bold py-1 px-2.5 rounded-md text-xs shadow-lg">
              <BookOpen className="w-3 h-3" />
              {type}
            </div>
          </div>

          {/* Access Badge */}
          {/* <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/95 backdrop-blur-sm text-gray-700 font-medium py-1 px-2 rounded-md text-xs shadow-sm">
              {access === "PUBLIC" ? "Miễn phí" : "Có phí"}
            </div>
          </div> */}
        </div>

        {/* Content Container */}
        <div className="p-3 flex flex-col flex-1">
          {/* Title - Cố định chiều cao */}
          <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-200 h-10 flex items-start">
            {title?.text || title}
          </h3>

          {/* Stats Cards - Compact layout */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 text-xs">
                <FileQuestion className="w-3 h-3" />
                <span className="font-bold">{countExam}</span>
              </div>
              <div className="text-xs text-blue-600 font-medium">Đề thi</div>
            </div>
            <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 text-xs">
                <BookOpen className="w-3 h-3" />
                <span className="font-bold">{countTest}</span>
              </div>
              <div className="text-xs text-purple-600 font-medium">Bài tập</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>2.5k học viên</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>60 phút</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 mt-auto h-8 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 hover:shadow-md">
            <span className="flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3" />
              LUYỆN NGAY
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
