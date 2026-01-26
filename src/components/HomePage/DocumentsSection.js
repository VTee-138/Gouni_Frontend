import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DocumentCard from "../Documents/DocumentCard";

export default function DocumentsSection({ documents }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Tài liệu học tập
            </h2>
            <p className="text-lg text-gray-600">
              Kho tài liệu phong phú để hỗ trợ quá trình học tập
            </p>
          </div>
          <Link
            to="/documents"
            className="hidden sm:inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {documents.slice(0, 6).map((document) => (
            <DocumentCard key={document._id} {...document} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <Link
          to="/documents"
          className="sm:hidden flex items-center justify-center gap-2 w-full py-4 text-red-600 font-semibold border-2 border-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
        >
          <span>Xem tất cả tài liệu</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
