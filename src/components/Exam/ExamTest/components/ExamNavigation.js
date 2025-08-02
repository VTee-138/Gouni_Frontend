import React from "react";
import CurrentTimer from "../CurrentTimer";
import Countdown from "../Countdown";

const ExamNavigation = ({
  current,
  isDisabledBack,
  isDisabledNext,
  handleNav,
  examData,
  examRoomId,
  handleSubmit,
  setShowInfoPanel,
  showInfoPanel,
}) => {
  return (
    <div className="mt-5 bg-slate-500 rounded-lg text-white shadow-md">
      {/* Mobile Layout (sm và nhỏ hơn) */}
      <div className="block sm:hidden px-3 py-3 space-y-3">
        {/* Row 1: Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            className={`flex items-center gap-1 px-3 py-2 text-sm ${
              isDisabledBack
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
            } rounded-md font-medium transition-colors`}
            disabled={isDisabledBack}
            onClick={() => handleNav(current, false)}
          >
            <span>‹ Câu trước</span>
            <span className="hidden xs:inline">Trước</span>
          </button>

          <button
            className={`flex items-center gap-1 px-3 py-2 text-sm ${
              isDisabledNext
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
            } rounded-md font-medium transition-colors`}
            disabled={isDisabledNext}
            onClick={() => handleNav(current, true)}
          >
            <span className="hidden xs:inline">Tiếp</span>
            <span>Câu tiếp ›</span>
          </button>
        </div>

        {/* Row 2: Time displays */}
        <div className="flex justify-between items-center text-center">
          <div className="flex-1">
            <div className="text-xs text-gray-300 mb-1">Thời gian hiện tại</div>
            <div className="text-lg font-mono font-bold text-white">
              <CurrentTimer
                exam={examData}
                current={current}
                examRoomId={examRoomId}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <Countdown
              exam={examData}
              onComplete={handleSubmit}
              examRoomId={examRoomId}
            />
          </div>
        </div>

        {/* Row 3: Submit button */}
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] text-white rounded-md font-medium hover:bg-[#b91c1c] transition-colors text-sm"
            onClick={() => setShowInfoPanel(!showInfoPanel)}
          >
            <span>Menu / Nộp bài</span>
          </button>
        </div>
      </div>

      {/* Tablet Layout (sm đến md) */}
      <div className="hidden sm:block md:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Back button */}
          <div className="flex-shrink-0">
            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm ${
                isDisabledBack
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
              } rounded-md font-medium transition-colors`}
              disabled={isDisabledBack}
              onClick={() => handleNav(current, false)}
            >
              <span>‹</span>
              <span>Câu trước</span>
            </button>
          </div>

          {/* Center: Time displays */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs md:text-[1rem] text-gray-300">
                Thời gian hiện tại
              </div>
              <div className="text-lg font-mono font-bold text-white">
                <CurrentTimer
                  exam={examData}
                  current={current}
                  examRoomId={examRoomId}
                />
              </div>
            </div>

            <div className="text-center flex flex-col items-center justify-center">
              <Countdown
                exam={examData}
                onComplete={handleSubmit}
                examRoomId={examRoomId}
              />
            </div>
          </div>

          {/* Right: Next and Submit buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm ${
                isDisabledNext
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
              } rounded-md font-medium transition-colors`}
              disabled={isDisabledNext}
              onClick={() => handleNav(current, true)}
            >
              <span>Câu tiếp</span>
              <span>›</span>
            </button>

            <button
              className="flex items-center gap-1 px-3 py-2 bg-[#dc2626] text-white rounded-md font-medium hover:bg-[#b91c1c] transition-colors text-sm"
              onClick={() => setShowInfoPanel(!showInfoPanel)}
            >
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout (md và lớn hơn) */}
      <div className="hidden md:flex items-center justify-between px-4 py-3">
        {/* Left: Back button */}
        <div className="flex items-center gap-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 ${
              isDisabledBack
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
            } rounded-md font-medium transition-colors`}
            disabled={isDisabledBack}
            onClick={() => handleNav(current, false)}
          >
            <span>‹</span>
            <span>Câu trước</span>
          </button>
        </div>

        {/* Center: Current question time */}
        <div className="flex flex-col lg:flex-row text-center  items-center">
          <div className="text-[1rem] text-gray-300 mr-0 lg:mr-5">
            Thời gian hiện tại
          </div>
          <div className="text-xl font-mono font-bold text-white">
            <CurrentTimer
              exam={examData}
              current={current}
              examRoomId={examRoomId}
            />
          </div>
        </div>

        {/* Right: Time left, Next and Submit buttons */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <Countdown
              exam={examData}
              onComplete={handleSubmit}
              examRoomId={examRoomId}
            />
          </div>

          <button
            className={`flex items-center gap-2 px-4 py-2 ${
              isDisabledNext
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
            } rounded-md font-medium transition-colors`}
            disabled={isDisabledNext}
            onClick={() => handleNav(current, true)}
          >
            <span>Câu tiếp</span>
            <span>›</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] text-white rounded-md font-medium hover:bg-[#b91c1c] transition-colors"
            onClick={() => setShowInfoPanel(!showInfoPanel)}
          >
            <span>‹ Mở menu / Nộp bài</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamNavigation;
