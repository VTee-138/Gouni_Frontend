import React from "react";
import { BookOpen, FileText, Target, Users } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Khóa học đa dạng",
    description: "Hàng trăm khóa học từ cơ bản đến nâng cao, được thiết kế bởi chuyên gia hàng đầu."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Tài liệu phong phú",
    description: "Thư viện tài liệu học tập chất lượng cao, luôn được cập nhật và miễn phí."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Luyện thi thông minh",
    description: "Hệ thống phòng thi online với công nghệ AI, đánh giá năng lực chính xác."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Cộng đồng năng động",
    description: "Kết nối với hàng nghìn học viên, chia sẻ kiến thức và cùng nhau phát triển."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn 86HSK?
          </h2>
          <p className="text-lg text-gray-600">
            Chúng tôi cung cấp trải nghiệm học tập toàn diện với công nghệ hiện đại và đội ngũ giảng viên chất lượng.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
