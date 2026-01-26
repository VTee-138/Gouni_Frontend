import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ExamRoomCard from "../ExamRoom/ExamRoomCard";

export default function ExamRoomsSection({ examRooms }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Phòng luyện thi
            </h2>
            <p className="text-lg text-gray-600">
              Rèn luyện kỹ năng và kiểm tra năng lực với hệ thống thi online
            </p>
          </div>
          <Link
            to="/exam-rooms?category=EXAM_ROOM"
            className="hidden sm:inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Exam Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {examRooms.slice(0, 6).map((examRoom) => (
            <ExamRoomCard key={examRoom._id} {...examRoom} category="EXAM_ROOM" />
          ))}
        </div>

        {/* Mobile View All Button */}
        <Link
          to="/exam-rooms?category=EXAM_ROOM"
          className="sm:hidden flex items-center justify-center gap-2 w-full py-4 text-red-600 font-semibold border-2 border-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
        >
          <span>Xem tất cả phòng thi</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
