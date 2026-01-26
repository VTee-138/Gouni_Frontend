import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  Target, 
  Clock, 
  Menu, 
} from "lucide-react";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { getCourses } from "../../services/CourseService";
import { getDocuments } from "../../services/DocumentService";
import { getExamRooms } from "../../services/ExamRoomService";
import { getUserInfo } from "../../services/AuthService";
import UserSidebar from "../UserSidebar";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    coursesCount: 0,
    documentsCount: 0,
    examRoomsCount: 0,
    totalExams: 0,
    avgScore: 0,
    studyTime: 0
  });

  const location = useLocation();
  const userInfo = getUserInfo();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const userId = userInfo?.id;

        const [coursesResponse, documentsResponse, examRoomsResponse] = await Promise.all([
          getCourses(1, 100, "", "", "", "", userId),
          getDocuments(1, 100, "", "", "", "", userId),
          getExamRooms()
        ]);

        setStats({
          coursesCount: coursesResponse?.data?.length || 0,
          documentsCount: documentsResponse?.data?.length || 0,
          examRoomsCount: examRoomsResponse?.data?.length || 0,
          // Placeholder data until backend APIs are available
          totalExams: 15,
          avgScore: 8.5,
          studyTime: 124
        });
      } catch (error) {
        const message = error?.response?.data?.message || "Có lỗi xảy ra";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Tổng số bài thi",
      value: stats.totalExams,
      label: "Bài đã làm",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Điểm trung bình",
      value: stats.avgScore,
      label: "Trên thang điểm 10",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Thời gian học",
      value: `${stats.studyTime}h`,
      label: "Tổng thời gian",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="lg:ml-72 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Header Toggle */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Access placeholders - kept for layout completeness */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
                <Link to="/profile" className="text-sm text-red-600 font-semibold hover:underline">
                  Xem tất cả
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <Clock size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Đăng nhập hệ thống</h4>
                      <p className="text-sm text-gray-500">2 giờ trước</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
