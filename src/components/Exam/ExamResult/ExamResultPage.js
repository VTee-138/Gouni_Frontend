/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, Award, History, ListChecks } from "lucide-react";
import moment from "moment";
import { getResultById, checkCorrectAnswers } from "../../../services/TestService";
import { getExamDetail } from "../../../services/ExamService";
import Loading from "../../Loading";
import MathRenderer from "../../../common/MathRenderer";
import ExamNumber from "../ExamTest/ExamNumber";

function ExamResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultDetail, setResultDetail] = useState(null); // User info, score, etc.
  const [examData, setExamData] = useState(null); // Questions content
  const [resultMap, setResultMap] = useState({}); // { "Câu 1": true, "Câu 2": false }
  
  const [currentQuestionReview, setCurrentQuestionReview] = useState(null); // Scroll to or highlight

  const handleFetch = async () => {
    try {
      setLoading(true);
      
      // Parallel fetch for efficiency
      const [resResult, resExam, resCorrectness] = await Promise.all([
          getResultById(id),
          getExamDetail(id),
          checkCorrectAnswers(id)
      ]);

      setResultDetail(resResult?.data); // Adjusted base on controller return
      setExamData(resExam?.data);
      setResultMap(resCorrectness?.data || {}); // Adjusted based on checkCorrectAnswers return

    } catch (error) {
      console.log("Error fetching result:", error);
      const message = error?.response?.data?.message || "Có lỗi xảy ra khi tải kết quả";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id]);

  const questionList = useMemo(() => {
    if (!examData) return [];
    return examData?.questions.filter((q) => q.type !== "MQ") || [];
  }, [examData]);


  const scrollToQuestion = (index) => {
      const questionKey = questionList[index]?.question;
      const element = document.getElementById(`question-${index}`);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setCurrentQuestionReview(questionKey);
      }
  };

  console.log(id);
  console.log("Result Detail:", resultDetail);
  console.log("Exam Data:", examData);
  console.log("Result Map:", resultMap);

  if (loading || !resultDetail || !examData) {
    return <Loading />;
  }
  
  // Helpers
  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m} phút ${s} giây`;
  };

  const getScoreColor = (score) => {
      if (score >= 9) return "text-green-600";
      if (score >= 5) return "text-yellow-600";
      return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER SUMMARY */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
           <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Award className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{examData.title?.text || examData.title}</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <History className="w-4 h-4" /> 
                            Nộp bài lúc: {moment(resultDetail.createdAt).format("HH:mm DD/MM/YYYY")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 md:gap-12 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                     <div className="text-center">
                         <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Điểm số</p>
                         <p className={`text-2xl font-black ${getScoreColor(resultDetail.total_score)}`}>{resultDetail.total_score}</p>
                     </div>
                     <div className="w-px h-10 bg-gray-200"></div>
                     <div className="text-center">
                         <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Số câu đúng</p>
                         <p className="text-2xl font-black text-gray-800">{resultDetail.numberOfCorrectAnswers}/{examData.numberOfQuestions}</p>
                     </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                     <div className="text-center">
                         <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Thời gian</p>
                         <p className="text-xl font-bold text-gray-800">{formatTime(resultDetail.examCompledTime)}</p>
                     </div>
                </div>
                
                <div className="flex gap-2">
                     <button onClick={() => navigate('/exam')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
                        Thoát
                     </button>
                      <button onClick={() => navigate(`/exam/test/${id}`)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-200 transition-all">
                        Làm lại
                     </button>
                </div>
           </div>
      </div>

      <div className="flex-1 max-w-[1920px] mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
         {/* LEFT: DETAIL REVIEW */}
         <div className="flex-1 space-y-6">
             {questionList.map((question, index) => {
                 const qKey = question.question; // "Câu 1"
                 const isCorrect = resultMap[qKey]; // true/false
                 const userAnswer = resultDetail.userAnswers?.[qKey]; // "A" or "True"
                 const correctAnswer = question.answer;

                 const isCurrentHighlight = currentQuestionReview === qKey;

                 return (
                     <div 
                        id={`question-${index}`} 
                        key={index} 
                        className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 scroll-mt-32
                            ${isCorrect === true ? 'border-green-100 shadow-sm' : isCorrect === false ? 'border-red-100 shadow-sm' : 'border-gray-100'}
                            ${isCurrentHighlight ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                    >
                         <div className="flex items-start gap-4 mb-4">
                             <div className={`
                                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                ${isCorrect === true ? 'bg-green-100 text-green-600' : isCorrect === false ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}
                             `}>
                                 {index + 1}
                             </div>
                             <div className="flex-1 pt-1">
                                 <h3 className="text-gray-900 font-medium text-lg leading-relaxed">
                                     <MathRenderer content={question.contentQuestions || question.question} />
                                 </h3>
                                 {question.imageUrl && (
                                     <img src={question.imageUrl} alt="Question" className="mt-4 rounded-lg max-h-60 object-contain border" />
                                 )}
                             </div>
                             <div className="flex-shrink-0">
                                 {isCorrect === true && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                                 {isCorrect === false && <XCircle className="w-8 h-8 text-red-500" />}
                             </div>
                         </div>

                         {/* Answer Section */}
                         <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                             <div className="flex gap-2 text-sm">
                                 <span className="font-semibold text-gray-500 uppercase tracking-wider w-24">Bạn chọn:</span>
                                 <span className={`font-bold ${isCorrect === true ? 'text-green-700' : isCorrect === false ? 'text-red-600' : 'text-gray-500'}`}>
                                     {userAnswer ? (typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : userAnswer) : <span className="italic text-gray-400">Không trả lời</span>}
                                 </span>
                             </div>
                             
                             {/* Show correct answer if wrong (Optional: depends if you want to reveal key) */}
                             {isCorrect === false && (
                                 <div className="flex gap-2 text-sm border-t border-gray-200 pt-2 mt-2">
                                     <span className="font-semibold text-gray-500 uppercase tracking-wider w-24">Đáp án đúng:</span>
                                     <span className="font-bold text-blue-600">
                                         {correctAnswer} 
                                     </span>
                                 </div>
                             )}

                             {question.explain && (
                                 <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm text-blue-900">
                                     <span className="font-bold block mb-1">Giải thích:</span>
                                     <MathRenderer content={question.explain} />
                                 </div>
                             )}
                         </div>
                     </div>
                 )
             })}
         </div>

         {/* RIGHT: NAVIGATION SIDEBAR */}
         <div className="w-full lg:w-[320px] lg:flex-shrink-0">
             <div className="sticky top-28 space-y-6">
                 <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 p-6">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                         <ListChecks className="w-5 h-5 text-blue-600" />
                         Danh sách câu hỏi
                     </h3>
                     
                     <ExamNumber 
                        totalQuestions={questionList.length}
                        questionList={questionList}
                        hasStarted={true}
                        resultMode={true}
                        resultMap={resultMap}
                        currentQuestion={currentQuestionReview}
                        onSelect={(index) => scrollToQuestion(index)}
                     />

                     <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs font-medium text-gray-600">
                         <div className="flex items-center gap-2">
                             <span className="w-3 h-3 bg-green-100 border border-green-200 rounded"></span> Đúng ({resultDetail.numberOfCorrectAnswers})
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="w-3 h-3 bg-red-50 border border-red-200 rounded"></span> Sai ({examData.numberOfQuestions - resultDetail.numberOfCorrectAnswers})
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}

export default ExamResultPage;
