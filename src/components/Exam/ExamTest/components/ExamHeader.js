import React from "react";
import logo from "../../../../images/logo.png";

const ExamHeader = ({ examData }) => {
  return (
    <div className="flex items-center px-3 sm:px-4 lg:px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center w-full">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Logo container với kích thước responsive */}
          <div className="w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 rounded-lg flex items-center justify-center shadow-md">
            <img
              src={logo}
              alt="logo"
              className="w-auto h-6 sm:h-7 md:h-8 filter brightness-110 object-cover"
            />
          </div>

          {/* Text với responsive typography */}
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-[#d8232a] truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg leading-tight">
            {examData?.title?.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
