import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            Nền tảng học trực tuyến hàng đầu Việt Nam
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Học tập không giới hạn,
            <br />
            <span className="text-red-600">Tương lai rộng mở</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Khám phá hàng nghìn khóa học chất lượng cao, tài liệu học tập phong phú và phòng luyện thi thông minh. 
            Cùng 86HSK chinh phục mọi mục tiêu học tập.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Bắt đầu miễn phí</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200 cursor-pointer"
            >
              <Play className="w-5 h-5" />
              <span>Khám phá khóa học</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-gray-100">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Học viên</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Khóa học</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-sm text-gray-600">Hài lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
