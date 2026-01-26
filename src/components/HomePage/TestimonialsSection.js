import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Học viên khóa THPT",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=DC2626&color=fff",
    rating: 5,
    content: "86HSK đã giúp tôi cải thiện điểm số đáng kể. Các giảng viên rất tận tâm và tài liệu học tập được cập nhật liên tục."
  },
  {
    name: "Trần Thị B",
    role: "Học viên luyện thi đại học",
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=DC2626&color=fff",
    rating: 5,
    content: "Hệ thống luyện thi online rất thông minh, giúp tôi xác định điểm yếu và cải thiện hiệu quả. Tôi đã đỗ trường mơ ước!"
  },
  {
    name: "Lê Văn C",
    role: "Phụ huynh học sinh",
    avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=DC2626&color=fff",
    rating: 5,
    content: "Con tôi rất hứng thú với các khóa học trên 86HSK. Giao diện thân thiện và dễ sử dụng, phù hợp với học sinh mọi lứa tuổi."
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Học viên nói gì về 86HSK?
          </h2>
          <p className="text-lg text-gray-600">
            Hàng nghìn học viên đã tin tưởng và đạt được kết quả xuất sắc cùng chúng tôi.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 mb-6">
                <Quote className="w-5 h-5" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
