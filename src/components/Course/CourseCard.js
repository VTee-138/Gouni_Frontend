import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";

export default function CourseCard({
  _id,
  title,
  price,
  type,
  imgUrl,
  discountPercent,
  isBuy,
}) {
  const hasDiscount = discountPercent && discountPercent < 0;
  const discount = hasDiscount ? Math.abs(discountPercent) : 0;
  const finalPrice = hasDiscount
    ? Math.round(price * (1 - discount / 100))
    : price;

  // Định dạng lại giá
  const formatPrice = (num) => num.toLocaleString("vi-VN") + "đ";

  return (
    <Link to={`/courses/${_id}`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full transform group-hover:scale-[1.02] border border-gray-100 flex flex-col max-h-[380px]">
        {/* Image Container - Thu nhỏ chiều cao */}
        <div className="relative overflow-hidden h-40 sm:h-28 md:h-32 flex-shrink-0">
          <img
            src={imgUrl}
            alt={type}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges - Thu nhỏ */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-1 px-2 rounded-full text-xs shadow-lg">
                GIẢM {discount}%
              </div>
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/90 backdrop-blur-sm text-gray-700 font-medium py-0.5 px-1.5 rounded-full text-xs shadow-md">
              {type || "Khóa học"}
            </div>
          </div>
        </div>

        {/* Content Container - Compact hơn */}
        <div className="p-3 flex flex-col flex-1">
          {/* Title - Thu nhỏ margin */}
          <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-200">
            {title?.text}
          </h3>

          {/* Stats - Compact hơn */}
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>1.2k</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>12h</span>
            </div>
          </div>

          {/* Price - Thu nhỏ margin và font size */}
          <div className="mb-3 flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-red-600 text-base font-bold">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-gray-400 text-xs line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-red-600 text-base font-bold">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Button - Thu nhỏ padding */}
          <button
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 transform mt-auto
              ${
                isBuy
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
            disabled={isBuy}
          >
            {isBuy ? (
              <span className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-1.5 h-0.5 bg-white rounded-full transform rotate-45"></div>
                </div>
                ĐÃ MUA
              </span>
            ) : (
              "LIÊN HỆ NGAY"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
