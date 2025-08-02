import { FileText, DoorOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CourseSupport({
  documents = [],
  examRooms = [],
  isBuy,
}) {
  const [showDocs, setShowDocs] = useState(false);
  const [showRooms, setShowRooms] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <div className="space-y-6">
        {/* Tài liệu bổ trợ */}
        <div>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-red-600 focus:outline-none"
            onClick={() => setShowDocs((v) => !v)}
            type="button"
          >
            <FileText className="text-red-600" />
            TÀI LIỆU BỔ TRỢ
            {showDocs ? (
              <ChevronDown className="w-5 h-5 ml-1" />
            ) : (
              <ChevronRight className="w-5 h-5 ml-1" />
            )}
          </button>
          {showDocs &&
            (documents.length === 0 ? (
              <div className="text-gray-400 italic">
                Chưa có tài liệu bổ trợ
              </div>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <Link
                    to={isBuy ? `/documents/${doc._id}` : "#"}
                    onClick={() => {
                      if (!isBuy) {
                        toast.warn("Vui lòng mua khóa học để xem tài liệu");
                      }
                    }}
                    key={doc._id}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </span>
                    <span className="flex-1 text-gray-800 line-clamp-1 break-all">
                      {doc.title?.text}
                    </span>
                  </Link>
                ))}
              </ul>
            ))}
        </div>
        {/* Phòng thi bổ trợ */}
        <div>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-red-600 focus:outline-none"
            onClick={() => setShowRooms((v) => !v)}
            type="button"
          >
            <DoorOpen className="text-red-600" />
            PHÒNG THI BỔ TRỢ
            {showRooms ? (
              <ChevronDown className="w-5 h-5 ml-1" />
            ) : (
              <ChevronRight className="w-5 h-5 ml-1" />
            )}
          </button>
          {showRooms &&
            (examRooms.length === 0 ? (
              <div className="text-gray-400 italic">
                Chưa có phòng thi bổ trợ
              </div>
            ) : (
              <ul className="space-y-2">
                {examRooms.map((room) => (
                  <Link
                    to={isBuy ? `/exam-rooms/${room._id}` : "#"}
                    onClick={() => {
                      if (!isBuy) {
                        toast.warn("Vui lòng mua khóa học để xem phòng thi");
                      }
                    }}
                    key={room._id}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      <DoorOpen className="w-5 h-5 text-gray-400" />
                    </span>
                    <span className="flex-1 text-gray-800 line-clamp-1 break-all">
                      {room.title?.text || room.title}
                    </span>
                  </Link>
                ))}
              </ul>
            ))}
        </div>
      </div>
    </div>
  );
}
