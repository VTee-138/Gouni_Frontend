/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getExamDetail } from "../../services/ExamService";
import Loading from "../Loading";
import ExamInfo from "./ExamInfo";
import { checkJwtExistsAndExpired } from "../../services/AuthService";

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [searchParams] = useSearchParams();
  const examRoomId = searchParams.get("examRoomId");

  const handleFetch = async () => {
    try {
      setLoading(true);
      const responseExam = await getExamDetail(id, examRoomId);
      const examData = responseExam?.data;
      if (examData) {
        setExamData(examData);
      }
    } catch (error) {
      console.log(" handleFetch ~ error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
      navigate(`/courses/${error?.response?.data?.courseId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id, examRoomId]);

  const handleStartExam = () => {
    if (checkJwtExistsAndExpired()) {
       navigate(`/exam/test/${id}?examRoomId=${examRoomId || ''}`);
    } else {
       toast.error("Vui lòng đăng nhập để bắt đầu bài thi");
       navigate("/login");
    }
  };

  const handleViewHistory = () => {
    if (checkJwtExistsAndExpired()) {
       navigate(`/exam/history/${id}`);
    } else {
       toast.error("Vui lòng đăng nhập để xem lịch sử");
       navigate("/login");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="flex-1 max-w-[1920px] mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 w-full lg:min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[85vh] flex flex-col relative overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <ExamInfo
                handleStartExam={handleStartExam}
                handleViewHistory={handleViewHistory}
                examData={examData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
