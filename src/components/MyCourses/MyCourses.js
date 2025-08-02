import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  ShoppingCart,
  Camera,
  ChevronDown,
  BookOpenText,
} from "lucide-react";
import { getUserInfo } from "../../services/AuthService";
import Header from "../Header/Header";
import {
  getMyCourses,
  getUserInfoById,
  updateInfoUser,
  updatePassword,
} from "../../services/UserService";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../Loading";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import CourseCard from "../Course/CourseCard";
import PaginationCustom from "../PaginationCustom";

export default function MyCourses() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    school: "",
    province: "",
  });
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await getUserInfoById();
        console.log(" handleFetch ~ response:", response);
        if (response && response.data) {
          const user = response.data;
          setUserInfo(user);
        }
      } catch (error) {
        console.log(error);
        const message = error?.response?.data?.message;
        toast.error(message);
      }
    };
    handleFetch();
  }, []);
  // Fetch courses
  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getMyCourses(page, 6);
        console.log(" handleFetch ~ response:", response);
        if (response && response?.data) {
          const courses = response?.data?.map((item) => ({
            ...item.course,
            isBuy: true,
          }));
          setCoursesData(courses);
          setTotalPages(response?.totalPages);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, [page]);

  const sidebarItems = [
    {
      name: "Thông tin cá nhân",
      icon: User,
      active: false,
      color: "text-red-500",
      path: "/profile",
    },
    {
      name: "Khóa học của tôi",
      icon: BookOpen,
      active: true,
      color: "text-red-500",
      path: "/my-courses",
    },
  ];
  // Pagination handlers
  const handleChangePage = (page) => setPage(page);
  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page - 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline transition-colors">
              Trang chủ
            </Link>{" "}
            /{" "}
            <span className="text-gray-800 font-medium">Khóa học của tôi</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* User Avatar and Info */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-600 mx-auto mb-4">
                      {userInfo?.fullName?.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {userInfo?.fullName || "Vô danh"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tham gia từ:{" "}
                    {moment(userInfo?.createdAt).format("DD/MM/YYYY")}
                  </p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {sidebarItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        item.active
                          ? "bg-red-50 text-red-600 border-l-4 border-red-500"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-3">
              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loading />
                </div>
              ) : (
                <>
                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {coursesData.map((course) => (
                      <div
                        key={course.id}
                        className="transform hover:scale-105 transition-transform duration-200"
                      >
                        <CourseCard {...course} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {coursesData?.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <Stack
                        sx={{ width: "100%", margin: "0 auto" }}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <PaginationCustom
                          totalPage={totalPages}
                          currentPage={page}
                          handleChangePage={handleChangePage}
                          handleNextPage={handleNextPage}
                          handlePrevPage={handlePrevPage}
                        />
                      </Stack>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <BookOpenText size={64} className="mx-auto" />
                      </div>
                      <Typography
                        fontSize={"20px"}
                        fontWeight={"500"}
                        color="text.secondary"
                      >
                        Không có khóa học nào được tìm thấy
                      </Typography>
                      <Typography
                        fontSize={"14px"}
                        color="text.secondary"
                        className="mt-2"
                      >
                        Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục
                        khác
                      </Typography>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
