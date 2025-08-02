import React from "react";
import Countdown from "../Countdown";
import { getUserInfo } from "../../../../services/AuthService";

const ExamInfoPanel = ({
  showInfoPanel,
  setShowInfoPanel,
  examData,
  examRoomId,
  handleSubmit,
  questions,
  current,
  currentMQ,
  questionsMQ,
  isQuestionAnswered,
  markedQuestions,
  handleNavFromPanel,
  doneCount,
}) => {
  const jwt = JSON.parse(
    localStorage.getItem("jwt") ? localStorage.getItem("jwt") : "{}"
  );
  return (
    <>
      {/* Overlay để bắt sự kiện click bên ngoài */}
      {showInfoPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setShowInfoPanel(false)}
        ></div>
      )}

      {/* Info Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[432px] bg-white shadow-lg border-l border-gray-200 overflow-y-auto transition-transform duration-300 z-50 ${
          showInfoPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header với nút đóng */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setShowInfoPanel(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Student Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="text-gray-500 text-xs sm:text-sm md:text-base font-medium mb-2 sm:mb-3">
              Thông tin thí sinh
            </div>
            <div className="flex items-center mb-3 sm:mb-4 space-x-2">
              <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">
                Họ tên:
              </span>
              <span className="font-bold text-[#d8232a] decoration-2 underline-offset-2 text-sm sm:text-base md:text-lg">
                {getUserInfo()?.username || "Vô danh"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm whitespace-nowrap mr-5">
                  Thời gian còn lại
                </span>
                <Countdown
                  exam={examData}
                  examRoomId={examRoomId}
                  isTitle={false}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#dc2626] text-white rounded-lg font-semibold text-base hover:bg-[#b91c1c] transition-colors shadow min-w-[90px]"
              >
                Nộp bài
              </button>
            </div>
          </div>

          {/* Question Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex-grow overflow-y-auto">
            <div className="mb-2 flex flex-col items-center">
              <span className="text-gray-500 text-sm font-medium">
                Danh sách câu hỏi
              </span>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#1e40af] mr-2 flex items-center justify-center text-white text-xs font-bold"></div>
                    <span className="text-[10px]">Hiện tại</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#dc2626] mr-2 flex items-center justify-center text-white text-xs font-bold"></div>
                    <span className="text-[10px]">Đã trả lời</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#f59e0b] mr-2 flex items-center justify-center text-white text-xs font-bold"></div>
                    <span className="text-[10px]">Đánh dấu</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-gray-600 text-xs font-bold"></div>
                    <span className="text-[10px]">Chưa chọn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-1.5 mt-4">
              {questions.map((q, idx) => {
                // Xác định trạng thái của câu hỏi
                const questionNumber = parseInt(
                  q.question.match(/\d+/)?.[0] || "0"
                );
                const mqGroup = questionsMQ.find((e) =>
                  e?.range.includes(questionNumber)
                );

                // Logic xác định isCurrentQuestion
                let isCurrentQuestion = false;
                if (mqGroup) {
                  // Nếu là MQ question, check currentMQ
                  isCurrentQuestion = currentMQ === questionNumber;
                } else {
                  // Nếu không phải MQ, check current index
                  isCurrentQuestion = current === idx;
                }

                const isAnswered = isQuestionAnswered(q);
                const isMarked = markedQuestions.includes(idx);

                // Xác định class dựa trên trạng thái
                let buttonClass =
                  "w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 ";

                if (isCurrentQuestion) {
                  buttonClass += "bg-[#1e40af] text-white shadow-md";
                } else if (isMarked) {
                  buttonClass += "bg-[#f59e0b] text-white hover:bg-[#d97706]";
                } else if (isAnswered) {
                  buttonClass += "bg-[#dc2626] text-white hover:bg-[#b91c1c]";
                } else {
                  buttonClass += "bg-gray-200 text-gray-600 hover:bg-gray-300";
                }

                return (
                  <div key={idx}>
                    <button
                      className={buttonClass}
                      onClick={() => {
                        handleNavFromPanel(idx);
                        setShowInfoPanel(false);
                      }}
                      title={`Câu ${idx + 1}${
                        isMarked ? " (đã đánh dấu)" : ""
                      } - Nhấp đúp hoặc nhấp chuột phải để đánh dấu`}
                    >
                      {idx + 1}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 text-sm">Bạn đã hoàn thành</span>
              <span className="font-bold text-gray-800">
                {doneCount}/{questions.length}{" "}
                <span className="text-xs text-gray-500">câu</span>
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(doneCount / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-green-600">
                {Math.round((doneCount / questions.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamInfoPanel;
