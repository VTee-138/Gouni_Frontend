import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Users,
  FileQuestion,
  Clock,
  ArrowRight,
  Star,
  Trophy,
  Play,
} from "lucide-react";
import { toast } from "react-toastify";

const ExamCard = ({ item, examRoomId, courseId }) => {
  const navigate = useNavigate();

  return (
    <Link
      to={
        item?.isBuy
          ? `/exam/confirm-info/${item?._id}?examRoomId=${examRoomId}`
          : "#1"
      }
      onClick={() => {
        if (!item?.isBuy) {
          toast.warn("Bạn phải mua khóa học để tham gia đề thi này");
          navigate(`/courses/${courseId}`);
        }
      }}
      className="block group h-full"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full transform group-hover:scale-[1.02] border border-gray-100 flex flex-col">
        {/* Image Container - Thu nhỏ chiều cao */}
        <div className="relative overflow-hidden h-32 flex-shrink-0">
          <img
            src={
              item?.imgUrl ||
              "https://res.cloudinary.com/tuanpham/image/upload/v1748930669/ugz0qqkg2ad1y0bsyxeb.jpg"
            }
            alt={item?.title?.text}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Status Badge - Compact */}
          <div className="absolute top-2 right-2 z-10">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg
                ${item?.active ? "bg-green-500" : "bg-red-500"}`}
            >
              {item?.active ? <CheckCircle size={10} /> : <XCircle size={10} />}
              {item?.active ? "Đã mở" : "Chưa mở"}
            </div>
          </div>

          {/* Hot badge */}
          {item?.numberOfTest > 100 && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400/90 to-orange-500/90 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                <Star size={10} />
                Hot
              </div>
            </div>
          )}

          {/* Access Badge */}
          {/* Free/Paid badge */}
          <div
            className={`absolute left-3 ${
              item?.numberOfTest > 100 ? "top-10" : "top-3"
            }`}
          >
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm ${
                item?.access === "PUBLIC"
                  ? "bg-gradient-to-r from-green-500/90 to-emerald-600/90 group-hover:from-green-400 group-hover:to-emerald-500"
                  : "bg-gradient-to-r from-red-500/90 to-rose-600/90 group-hover:from-red-400 group-hover:to-rose-500"
              }`}
            >
              <Star size={10} />
              {item?.access === "PUBLIC" ? "Miễn phí" : "Có phí"}
            </div>
          </div>
        </div>

        {/* Content Container - Flexbox layout cố định */}
        <div className="p-3 flex flex-col flex-1 min-h-0">
          {/* Title - Cố định chiều cao */}
          <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-200 h-8 overflow-hidden">
            {item?.title?.text}
          </h3>

          {/* Stats Grid - 2x2 Compact */}
          <div className="grid grid-cols-2 gap-1.5 mb-3 flex-shrink-0">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Users className="w-2.5 h-2.5" />
                <span className="text-xs font-bold">
                  {item?.numberOfTest || 0}
                </span>
              </div>
              <div className="text-xs text-gray-600">Lượt thi</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <FileQuestion className="w-2.5 h-2.5" />
                <span className="text-xs font-bold">
                  {item?.numberOfQuestions || 0}
                </span>
              </div>
              <div className="text-xs text-gray-600">Câu hỏi</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Clock className="w-2.5 h-2.5" />
                <span className="text-xs font-bold">{item?.time || 0}</span>
              </div>
              <div className="text-xs text-gray-600">Phút</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Trophy className="w-2.5 h-2.5" />
                <span className="text-xs font-bold">{item?.type}</span>
              </div>
              <div className="text-xs text-gray-600">Kỳ thi</div>
            </div>
          </div>

          {/* Action Button - mt-auto để đẩy xuống dưới */}
          <button
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 mt-auto flex items-center justify-center gap-1 flex-shrink-0
              ${
                item?.isBuy
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            <span>{item?.isBuy ? "TRUY CẬP NGAY" : "CẦN MUA"}</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;
