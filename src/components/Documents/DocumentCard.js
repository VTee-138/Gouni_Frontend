import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Eye, FileText, Lock, Unlock } from "lucide-react";
import { toast } from "react-toastify";

export default function DocumentCard({
  _id,
  title,
  numberOfVisitors,
  numberOfDơwnload,
  description,
  imgUrl,
  access,
  type,
  isBuy,
  courseId,
}) {
  const navigate = useNavigate();

  return (
    <Link
      to={isBuy ? `/documents/${_id}` : "#1"}
      onClick={() => {
        if (!isBuy) {
          toast.warn("Bạn phải mua khóa học để xem tài liệu này");
          navigate(`/courses/${courseId}`);
        }
      }}
      className="block group h-full"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full transform group-hover:scale-[1.02] border border-gray-100 flex flex-col">
        {/* Image Container - Cố định chiều cao */}
        <div className="relative overflow-hidden h-32 flex-shrink-0">
          <img
            src={
              imgUrl ||
              "https://t4.ftcdn.net/jpg/08/02/96/03/360_F_802960375_JnRlFMd0buxoIGpSFNIayEJdcK3HAEpe.jpg"
            }
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Access Badge */}
          <div className="absolute top-1.5 right-1.5 z-10">
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold text-white shadow-md
              ${access === "PUBLIC" ? "bg-green-500" : "bg-orange-500"}
            `}
            >
              {access === "PUBLIC" ? (
                <>
                  <Unlock className="w-2.5 h-2.5" />
                  Miễn phí
                </>
              ) : (
                <>
                  <Lock className="w-2.5 h-2.5" />
                  Có phí
                </>
              )}
            </div>
          </div>

          {/* Type Badge */}
          {type && (
            <div className="absolute top-1.5 left-1.5 z-10">
              <div className="flex items-center gap-1 bg-blue-500 text-white font-bold py-0.5 px-1.5 rounded text-xs shadow-md">
                <FileText className="w-2.5 h-2.5" />
                {type}
              </div>
            </div>
          )}
        </div>

        {/* Content Container - Cố định layout */}
        <div className="p-3 flex flex-col flex-1">
          {/* Title - Cố định chiều cao */}
          <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-200 h-10 flex items-start">
            {title?.text}
          </h3>

          {/* Description - Cố định chiều cao */}
          <div className="h-5 mb-2 flex items-start">
            <p className="text-gray-500 text-xs line-clamp-1 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Stats Row - Cố định chiều cao và căn chỉnh */}
          <div className="flex items-center justify-between mb-3 text-xs h-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">{numberOfVisitors || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <Download className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">{numberOfDơwnload || 0}</span>
            </div>
          </div>

          {/* Action Button - Đẩy xuống dưới */}
          <button
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 mt-auto h-8 flex items-center justify-center
              ${
                isBuy
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {isBuy ? (
              <span className="flex items-center justify-center gap-1">
                <Download className="w-3 h-3" />
                TRUY CẬP
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                CẦN MUA
              </span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
