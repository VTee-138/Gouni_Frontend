import React, { useEffect } from "react";
import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Search, Facebook, Music, MessageCircle, Star } from "lucide-react";
import CourseCard from "../Course/CourseCard";
import hsa_img from "../../images/KHOAHOCHSA.jpg";
import tsa_img from "../../images/thi-tsa.png";
import thpt_img from "../../images/thpt.png";
import StarIcon from "@mui/icons-material/Star";
import DocumentCard from "../Documents/DocumentCard";
import Header from "../Header/Header";
import ExamRoomCard from "../ExamRoom/ExamRoomCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/CourseService";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { getDocuments } from "../../services/DocumentService";
import { getExamRooms } from "../../services/ExamRoomService";
import Footer from "../Footer/Footer";
import { getUserInfo } from "../../services/AuthService";

const SocialButton = ({
  icon,
  text,
  bgColor,
  textColor = "text-white",
  path,
}) => {
  return (
    <Link
      to={path}
      target="_blank"
      className={`${bgColor} ${textColor} px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity`}
    >
      {icon}
      <span className="truncate">{text}</span>
    </Link>
  );
};

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const splideOptions = {
    type: "loop",
    perPage: 5,
    perMove: 1,
    gap: "1rem",
    pagination: false,
    arrows: true,
    autoplay: true,
    interval: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: false,
    breakpoints: {
      1400: { perPage: 4, gap: "0.8rem" },
      1200: { perPage: 3, gap: "0.8rem" },
      900: { perPage: 2, gap: "0.6rem" },
      600: {
        perPage: 1,
        gap: "0.5rem",
        arrows: false,
        pagination: true,
      },
      400: {
        perPage: 1,
        gap: "0.5rem",
        arrows: false,
        pagination: true,
      },
    },
  };

  const [coursesData, setCoursesData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [examRoomsData, setExamRoomsData] = useState([]);
  const [examTrendingData, setExamTrendingData] = useState([]);
  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getCourses(
          1,
          6,
          "",
          "",
          "",
          "",
          getUserInfo()?.id
        );
        if (response && response?.data) {
          setCoursesData(response?.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, []);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getExamRooms();
        if (response && response?.data) {
          setExamRoomsData(response?.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, []);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getDocuments(
          1,
          6,
          "",
          "",
          "",
          "",
          getUserInfo()?.id
        );
        if (response && response?.data) {
          setDocumentsData(response?.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Banner */}
        <div className="bg-red-800 h-32 sm:h-40 md:h-48 lg:h-56 rounded-lg flex items-center justify-center text-white text-base sm:text-lg md:text-xl font-medium mb-4 sm:mb-6">
          GOUNI EDUCATION
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SocialButton
            icon={<Facebook className="h-4 w-4 sm:h-5 sm:w-5" />}
            text="Fanpage chính thức của GOUNI"
            bgColor="bg-blue-600"
            path="https://www.facebook.com/gouniedu"
          />

          <SocialButton
            icon={<Facebook className="h-4 w-4 sm:h-5 sm:w-5" />}
            text="Group hỗ trợ của GOUNI"
            bgColor="bg-gray-800"
            path="https://www.facebook.com/groups/tsahsathpt.gouni"
          />

          <SocialButton
            icon={<Music className="h-4 w-4 sm:h-5 sm:w-5" />}
            text="TikTok chính thức của GOUNI"
            bgColor="bg-pink-600"
          />
          <SocialButton
            icon={<MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
            text="Zalo chính thức của GOUNI"
            bgColor="bg-blue-500"
          />
        </div>

        {/* Featured Products Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-red-600 font-bold text-base sm:text-lg flex items-center gap-2">
              <StarIcon className="text-yellow-400" /> CÁC KHÓA HỌC NỔI BẬT
            </h2>
            <div className="fex items-center text-red-600 hover:text-blue-600">
              <Link to="/courses" className="text-sm font-medium ">
                Xem tất cả
              </Link>
              <ArrowForwardIcon />
            </div>
          </div>
          <div className="splide-container">
            <Splide options={splideOptions}>
              {coursesData.map((course) => (
                <SplideSlide key={course._id}>
                  <CourseCard {...course} />
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </div>

        {/* Free Resources Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-red-600 font-bold text-base sm:text-lg flex items-center gap-2">
              <StarIcon className="text-yellow-400" /> CÁC TÀI LIỆU NỔI BẬT
            </h2>
            <div className="fex items-center text-red-600 hover:text-blue-600">
              <Link to="/documents" className="text-sm font-medium ">
                Xem tất cả
              </Link>
              <ArrowForwardIcon />
            </div>
          </div>
          <div className="splide-container">
            <Splide options={splideOptions}>
              {documentsData.map((document) => (
                <SplideSlide key={document._id}>
                  <DocumentCard {...document} />
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </div>

        {/* Exam Methods Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-red-600 font-bold text-base sm:text-lg flex items-center gap-2">
              <StarIcon className="text-yellow-400" /> PHÒNG LUYỆN THI
            </h2>
            <div className="fex items-center text-red-600 hover:text-blue-600">
              <Link
                to="/exam-rooms?category=EXAM_ROOM"
                className="text-sm font-medium "
              >
                Xem tất cả
              </Link>
              <ArrowForwardIcon />
            </div>
          </div>
          <div className="splide-container">
            <Splide options={splideOptions}>
              {examRoomsData.map((examRoom) => (
                <SplideSlide key={examRoom._id}>
                  <ExamRoomCard {...examRoom} category="EXAM_ROOM" />
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
