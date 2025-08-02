import React from "react";
import {
  Clock,
  Calendar,
  HelpCircle,
  FileText,
  User,
  ChevronRight,
} from "lucide-react";

const ExamInfo = ({ handleStartExam, examData }) => {
  return (
    <div className="bg-white rounded-lg p-4 max-w-md font-sans">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold text-gray-800 mb-2 leading-tight">
          {examData?.title?.text}
        </h1>

        {/* Exam Code and QR Code */}
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="text-left">
            <span className="text-gray-600 text-xs">Mã đề thi: </span>
            <span className="font-semibold text-gray-800 text-sm">
              {examData?._id}
            </span>
          </div>
          {/* <div className="w-10 h-10 bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
          </div> */}
        </div>
      </div>

      {/* Exam Details */}
      <div className="space-y-2 mb-4">
        {/* Test Duration */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-xs">Thời gian làm bài</span>
          </div>
          <span className="font-semibold text-[#cd1628] text-sm">
            {examData?.time} phút
          </span>
        </div>

        {/* Entry Time */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-xs">Thời gian vào thi</span>
          </div>
          <span className="font-semibold text-[#cd1628] text-sm">
            Không thời hạn
          </span>
        </div>

        {/* Number of Questions */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-xs">Số lượng câu hỏi</span>
          </div>
          <span className="font-semibold text-[#cd1628] text-sm">
            {examData?.numberOfQuestions}
          </span>
        </div>

        {/* Test Type */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-xs">Loại đề</span>
          </div>
          <span className="font-semibold text-[#cd1628] text-sm">
            {examData?.type}
          </span>
        </div>

        {/* Total Attempts */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-xs">
              Tổng lượt đã làm của đề
            </span>
          </div>
          <span className="font-semibold text-[#cd1628] text-sm">
            {examData?.numberOfTest} lượt
          </span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartExam}
        className="w-full bg-[#cd1628] hover:bg-[#cd1628] text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
      >
        <span>Bắt đầu thi</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ExamInfo;
