import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock, BookOpen, Monitor, Smartphone, Download } from "lucide-react";
import Header from "../Header/Header";
import { getCourseById } from "../../services/CourseService";
import { toast } from "react-toastify";
import Loading from "../Loading";
import CourseSupport from "./CourseSupport";
import Footer from "../Footer/Footer";

export default function CourseDetailPage() {
  const [courseData, setCourseData] = useState({});
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getCourseById(courseId);
        if (response && response?.data) {
          setCourseData(response?.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, [courseId]);

  // State cho mã giảm giá và thông báo
  const [discountInput, setDiscountInput] = useState("");
  const [discountMsg, setDiscountMsg] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(false);

  const handleApplyDiscount = () => {
    if (
      discountInput.trim().toUpperCase() ===
        courseData.discountCode?.toUpperCase() &&
      courseData.discountPercent < 0
    ) {
      setAppliedDiscount(true);
    } else {
      setAppliedDiscount(false);
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const originalPrice = courseData.price;
  const discountPercent = courseData.discountPercent || 0;
  const isDiscounted = appliedDiscount && discountPercent < 0;
  const finalPrice = isDiscounted
    ? Math.round(originalPrice * (1 - Math.abs(discountPercent) / 100))
    : originalPrice;

  const formatPrice = (num) => num?.toLocaleString("vi-VN") + " ₫";

  if (loading) return <Loading />;
  return (
    <div>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>
            {" / "}
            <Link to="/courses" className="hover:underline">
              Khóa học
            </Link>
            {" / "}
            <span className="text-gray-800 font-semibold">
              {courseData.title?.text}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {courseData.title?.text}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Thông tin và nội dung */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Giới thiệu */}
              <div className="bg-white rounded-lg shadow p-5">
                <h2 className="text-lg font-bold text-[#cd1628] mb-2">
                  Giới thiệu khóa học
                </h2>
                <p className="list-decimal list-inside text-gray-800 space-y-1">
                  {courseData?.description}
                </p>
              </div>
              {/* Nội dung */}
              <div className="bg-white rounded-lg shadow p-5">
                {/* Tiêu đề KHÔNG toggle */}
                <h2 className="text-lg font-bold text-[#cd1628] mb-2">
                  Nội dung khoá học
                </h2>

                <CourseSupport
                  documents={courseData?.documents}
                  examRooms={courseData?.examRooms}
                  isBuy={courseData?.isBuy}
                />
              </div>
            </div>

            {/* Right: Thông tin giá và đăng ký */}
            <div>
              <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
                <img
                  src={courseData.imgUrl}
                  alt={courseData.title}
                  className="w-full rounded mb-4 object-cover"
                  style={{ maxHeight: 220 }}
                />
                <div className="mb-2">
                  <span className="font-bold text-lg text-[#cd1628]">
                    {finalPrice?.toLocaleString()}đ
                  </span>
                  {isDiscounted && (
                    <span className="ml-2 line-through text-gray-400 text-base">
                      {originalPrice?.toLocaleString()}đ
                    </span>
                  )}
                </div>
                <div className="w-full mb-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountInput}
                    disabled={courseData?.isBuy}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:border-[#cd1628] transition"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={courseData?.isBuy}
                    className={`px-3 py-1 rounded text-sm font-semibold transition
                      ${
                        courseData?.isBuy
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-[#cd1628] text-white hover:bg-red-700 cursor-pointer"
                      }
                    `}
                  >
                    Áp dụng
                  </button>
                </div>
                {discountMsg && (
                  <div
                    className={`text-sm mb-2 ${
                      appliedDiscount ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {discountMsg}
                  </div>
                )}

                <button
                  className={`w-full font-bold py-2 rounded transition mb-4
                    ${
                      courseData?.isBuy
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-[#cd1628] text-white hover:bg-[#cd1628] cursor-pointer"
                    }
                  `}
                  disabled={courseData?.isBuy}
                  onClick={() => {
                    if (!courseData?.isBuy) {
                      navigate(`/thanh-toan/${courseData?._id}`, {
                        state: isDiscounted,
                      });
                    }
                  }}
                >
                  {courseData?.isBuy ? "ĐÃ MUA" : "ĐĂNG KÝ HỌC"}
                </button>

                <ul className="text-gray-800  text-sm space-y-2 w-full">
                  <li className="flex items-center gap-2">
                    <BookOpen size={18} /> Phòng luyện thi:{" "}
                    {courseData?.examRoomIds?.length || 0} phòng
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={18} /> Tài liệu:{" "}
                    {courseData?.documentIds?.length || 0} tài liệu
                  </li>
                  <li className="flex items-center gap-2">
                    <Monitor size={18} /> Học mọi lúc mọi nơi
                  </li>
                  <li className="flex items-center gap-2">
                    <Smartphone size={18} /> Học trên mọi thiết bị: Mobile, TV,
                    PC
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
