import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-3xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

          <div className="relative px-8 sm:px-12 lg:px-16 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Sẵn sàng bắt đầu hành trình học tập?
              </h2>

              {/* Description */}
              <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed">
                Tham gia cùng hàng nghìn học viên đang học tập và phát triển mỗi ngày. 
                Đăng ký miễn phí và trải nghiệm ngay hôm nay!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span>Đăng ký miễn phí</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-colors border-2 border-white cursor-pointer"
                >
                  <span>Xem khóa học</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
