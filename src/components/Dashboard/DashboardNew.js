import { useEffect, useState } from "react";
import { 
  FileText, 
  Target, 
  Clock, 
  Menu, 
  Bell,
} from "lucide-react";
import { toast } from "react-toastify";
import Loading from "../Loading";
import UserSidebar from "../UserSidebar";
import { getUserStats } from "../../services/TestService"; // Import service

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


  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getUserStats();
        if (res && res.data) {
          setStats(res.data);
        }
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
      color: "text-red-600",
      bg: "bg-red-50"
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
    <div className="bg-gray-50 min-h-screen pt-20">
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

            {/* Notifications Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={20} className="text-red-600" />
                  Thông báo
                </h3>
              </div>
              
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Bell size={48} className="mb-4 opacity-20" />
                <p>Chưa có thông báo nào</p>
                <p className="text-sm mt-1">Thông báo quan trọng sẽ xuất hiện tại đây</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
