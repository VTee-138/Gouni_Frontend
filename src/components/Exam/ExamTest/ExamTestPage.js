/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { X, Clock, ListChecks, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { getExamDetail } from "../../../services/ExamService";
import { postTest } from "../../../services/TestService";
import Loading from "../../Loading";

import Countdown from "./Countdown";
import ExamNumber from "./ExamNumber";
import MathRenderer from "../../../common/MathRenderer";

const STORAGE_KEY = "exam-answers";
const CURRENT_QUESTION_KEY = "current-question";

const ExamTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  
  // States specific to test taking
  const [currentQuestion, setCurrentQuestion] = useState();
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Sidebar state for mobile

  const [loadingAPI, setLoadingAPI] = useState(false);

  // Fetch Exam Data
  const handleFetch = async () => {
    try {
      setLoading(true);
      const responseExam = await getExamDetail(id);
      const data = responseExam?.data;
      if (data) {
        setExamData(data);
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.log(" handleFetch ~ error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
      navigate(`/exam/${id}`); // Go back to detail if error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id]);

  // Initialize Exam Session if not present
  useEffect(() => {
    if (examData) {
      const existingSession = sessionStorage.getItem("exam");
      if (!existingSession) {
        sessionStorage.setItem(
          "exam",
          JSON.stringify({
            _id: examData._id,
            time: examData.time,
            start: moment(new Date()),
          }),
        );
      }
      
      // Initialize First Question if not set
      const savedQuestion = sessionStorage.getItem(CURRENT_QUESTION_KEY);
      if (!savedQuestion) {
         const firstNonMQQuestion = examData?.questions?.find(
            (q) => q.type !== "MQ",
         );
         if (firstNonMQQuestion) {
             setCurrentQuestion(firstNonMQQuestion.question);
             sessionStorage.setItem(CURRENT_QUESTION_KEY, firstNonMQQuestion.question);
         }
      } else {
        setCurrentQuestion(savedQuestion);
      }
    }
  }, [examData]);

  // Load answers from session
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem(STORAGE_KEY);
    setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
  }, [id]);


  const questionList = useMemo(() => {
    if (!examData) return [];
    return examData?.questions.filter((q) => q.type !== "MQ") || [];
  }, [examData]);

  const questionListMQ = useMemo(() => {
    if (!examData) return [];

    const match = currentQuestion?.match(/Câu\s*hỏi\s*(\d+)/);
    const currentQuestionNumber = match ? parseInt(match[1], 10) : null;

    return (
      examData?.questions
        .filter((q) => q.type === "MQ")
        .map((q) => {
          if (
            q.range.some((rangeItem) => rangeItem === currentQuestionNumber)
          ) {
            return {
              ...q,
              showContent: true,
            };
          }
          return q;
        }) || []
    );
  }, [examData, currentQuestion]);


  const handleSelectQuestion = (index) => {
    const nextQuestion = questionList?.[index]?.question;
    sessionStorage.setItem(
      CURRENT_QUESTION_KEY,
      nextQuestion,
    );
    setCurrentQuestion(nextQuestion);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Handle Answer Change
  const handleAnswerChange = (value) => {
    setAnswers((prev) => {
        const newAnswers = { ...prev, [currentQuestion]: value };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
        return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      setLoadingAPI(true);
      const savedAnswers = sessionStorage.getItem("exam-answers");
      const examCompledTime = sessionStorage.getItem("time-left");
      const res = await postTest(id, {
        userAnswers: JSON.parse(savedAnswers) || {},
        examCompledTime: JSON.parse(examCompledTime),
        examId: id,
        access: examData.access,
      });

      toast.success(res.message);

      navigate(`/exam/result/${id}`);

      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem("exam"); 
      sessionStorage.removeItem("time-left");
      sessionStorage.removeItem(CURRENT_QUESTION_KEY);

      setLoadingAPI(false);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      setLoadingAPI(false);
    }
  };

  const current = questionList
    .filter((item) => item.type !== "MQ")
    ?.find?.((q) => q.question === currentQuestion);

  console.log("current", current);
  
  const sessionExam = JSON.parse(sessionStorage.getItem("exam"));

  // Check Helper
  const isSelected = (val) => {
      const currentAns = answers[currentQuestion];
      return currentAns === val; 
  };


  if (loading || !examData) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="flex-1 max-w-[1920px] mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Question Area */}
        <div className="flex-1 w-full lg:min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[85vh] flex flex-col relative overflow-hidden">
             
              <div className="flex flex-col gap-8 flex-1">
                {/* Parent Question / Content (If MQ) */}
                {questionListMQ.map(
                  (question, index) =>
                    question.showContent && (
                      <div
                        key={index}
                        className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100"
                      >
                        <h4 className="font-bold text-gray-900 text-lg mb-4 italic flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                          {question.title}
                        </h4>
                        <div className="prose max-w-none text-gray-800">
                          <MathRenderer content={question.contentQuestions} />
                        </div>
                        {question?.imageUrl && (
                          <div className="mt-4 flex justify-center">
                            <img
                              src={question?.imageUrl}
                              alt="Question"
                              className="max-w-full h-auto rounded-xl shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    ),
                )}

                {/* Current Question */}
                <div className="flex-1">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                      {currentQuestion}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="mb-8 p-1">
                    <div className="text-lg md:text-xl text-gray-900 leading-relaxed font-medium">
                      <MathRenderer content={current?.contentQuestions || current?.contentQuestion} />
                    </div>
                    {current?.imageUrl && (
                      <div className="mt-6 flex justify-center">
                        <img
                          src={current?.imageUrl}
                          alt={currentQuestion}
                          className="max-w-full h-auto rounded-xl shadow-md border border-gray-100"
                        />
                      </div>
                    )}
                  </div>

                  {/* ANSWER SECTION - START */}
                  <div className="mb-8 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600"/> 
                        Chọn đáp án:
                    </h3>

                    {/* Generic Render based on properties */}
                     {(() => {
                         if (!current) return null;
                         
                         // 1. MATCHING Questions
                         if (current.type === "Matching") {
                             // Assuming standard matching structure
                             const matchItems = current.questions || current.items || [];
                             if (matchItems.length > 0) {
                                return (
                                    <div className="space-y-3">
                                        {matchItems.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="font-semibold">{item.id || idx+1}.</div>
                                                <input 
                                                    type="text" 
                                                    className="border rounded p-2 w-24 text-center font-bold uppercase"
                                                    placeholder="A,B..."
                                                    value={answers[currentQuestion]?.[item.id] || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const currentAnsObj = typeof answers[currentQuestion] === 'object' ? answers[currentQuestion] : {};
                                                        handleAnswerChange({...currentAnsObj, [item.id]: val});
                                                    }}
                                                />
                                                <div className="flex-1"><MathRenderer content={item.content} /></div>
                                            </div>
                                        ))}
                                        <p className="text-sm text-gray-500 italic mt-2">* Nhập ký tự tương ứng với đáp án ghép nối</p>
                                    </div>
                                )
                             }
                         }

                         // 2. Options (Multiple Choice / True-False)
                         // Check for options array/object
                         const options = current.contentOptions || current.options || current.answers;
                         
                         // Prepare options array based on types
                         let displayOptions = [];
                         
                         // Type "DS" (True/False)
                         if (current.type === "DS") {
                            displayOptions = [
                                { id: "True", content: "Đúng" },
                                { id: "False", content: "Sai" }
                            ];
                         }
                         // Type "TN" (Flattened contentAnswerA, B, C...)
                         else if (current.type === "TN") {
                             if (current.contentAnswerA) displayOptions.push({ id: "A", content: current.contentAnswerA });
                             if (current.contentAnswerB) displayOptions.push({ id: "B", content: current.contentAnswerB });
                             if (current.contentAnswerC) displayOptions.push({ id: "C", content: current.contentAnswerC });
                             if (current.contentAnswerD) displayOptions.push({ id: "D", content: current.contentAnswerD });

                             // Fallback if no flattened fields found but has options array
                             if (displayOptions.length === 0 && options) {
                                  if (Array.isArray(options)) {
                                     displayOptions = options.map((opt, idx) => ({ id: String.fromCharCode(65 + idx), content: opt }));
                                  }
                             }
                         }
                         // Generic Options (Fallback for others)
                         else if (options) {
                             if (Array.isArray(options)) {
                                 displayOptions = options.map((opt, idx) => {
                                     if (typeof opt === 'string' || typeof opt === 'number') {
                                         return { id: String.fromCharCode(65 + idx), content: opt };
                                     }
                                     return { id: opt.id || String.fromCharCode(65 + idx), content: opt.content || opt.text || opt };
                                 });
                             } else if (typeof options === 'object') {
                                 displayOptions = Object.entries(options).map(([key, value]) => ({ id: key, content: value }));
                             }
                         }

                         // RENDER
                         if (displayOptions.length > 0) {
                             return (
                                 <div className="grid grid-cols-1 gap-3">
                                     {displayOptions.map((opt, idx) => {
                                         const optId = opt.id;
                                         const optContent = opt.content;
                                         const isChecked = isSelected(optId);

                                         return (
                                             <div 
                                                key={idx}
                                                onClick={() => handleAnswerChange(optId)}
                                                className={`
                                                    group relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4
                                                    ${isChecked 
                                                        ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                                                        : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/30'
                                                    }
                                                `}
                                             >
                                                 {/* Checkbox Indicator */}
                                                 <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                                     ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 group-hover:border-blue-400 bg-white'}
                                                 `}>
                                                     {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                 </div>

                                                 {/* Content */}
                                                 <div className={`flex-1 text-base ${isChecked ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                                                     <span className="font-bold mr-2 text-blue-600">{optId}.</span>
                                                     <span className="inline-block"><MathRenderer content={typeof optContent === 'string' || typeof optContent === 'number' ? optContent : optContent?.text || optContent} /></span>
                                                 </div>
                                             </div>
                                         )
                                     })}
                                 </div>
                             )
                         }

                         // 3. Fallback / Text Input
                         return (
                            <div className="relative">
                                <textarea
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none min-h-[120px] text-lg text-gray-700"
                                    placeholder="Nhập câu trả lời của bạn vào đây..."
                                    value={typeof answers[currentQuestion] === 'string' ? answers[currentQuestion] : ""}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
                                    Văn bản
                                </div>
                            </div>
                         );

                     })()}
                  </div>
                  {/* ANSWER SECTION - END */}

                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => {
                      const currentIndex = questionList?.findIndex(
                        (q) => q.question === currentQuestion,
                      );
                      const prevIndex = Math.max(0, currentIndex - 1);
                      handleSelectQuestion(prevIndex);
                    }}
                    disabled={currentQuestion === questionList?.[0]?.question}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                             ${
                               currentQuestion === questionList?.[0]?.question
                                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                 : "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-sm"
                             }
                        `}
                  >
                    <ChevronLeft size={20} /> Trước
                  </button>

                  <button
                    onClick={() => {
                      const currentIndex = questionList?.findIndex(
                        (q) => q.question === currentQuestion,
                      );
                      const nextIndex = Math.min(
                        questionList?.length - 1,
                        currentIndex + 1,
                      );
                      handleSelectQuestion(nextIndex);
                    }}
                    disabled={
                      currentQuestion ===
                      questionList[questionList?.length - 1]?.question
                    }
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                             ${
                               currentQuestion ===
                               questionList[questionList?.length - 1]?.question
                                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                 : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                             }
                        `}
                  >
                    Tiếp <ChevronRight size={20} />
                  </button>
                </div>
              </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Timer & Palette) */}
        
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
                {/* Countdown Header */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm z-10">
                  <div className="flex items-center justify-center gap-2 text-lg font-bold mb-1">
                    <Clock size={20} />
                    <Countdown exam={sessionExam} onComplete={handleSubmit} />
                  </div>
                  <p className="text-center text-blue-100 text-xs">
                    Thời gian còn lại
                  </p>
                </div>

                {/* Questions Grid */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <ExamNumber
                    totalQuestions={
                      questionList.filter((q) => q.type !== "MQ")?.length
                    }
                    onSubmit={handleSubmit}
                    onSelect={handleSelectQuestion}
                    hasStarted={true}
                    answers={answers}
                    currentQuestion={currentQuestion}
                    questionList={questionList}
                    loadingAPI={loadingAPI}
                  />
                </div>
                
                 {/* Footer with Submit Button */}
                 <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button 
                         onClick={handleSubmit}
                         disabled={loadingAPI}
                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingAPI ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>Nộp bài thi <CheckCircle2 size={18} /></>
                        )}
                    </button>
                 </div>

              </div>
            </div>

            {/* Mobile Drawer (Overlay) */}
            <div
              className={`
                    lg:hidden fixed inset-0 z-50 transition-opacity duration-300
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              ></div>

              {/* Drawer Content */}
              <div
                className={`
                        absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col
                        ${isOpen ? "translate-x-0" : "translate-x-full"}
                     `}
              >
                <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
                  <div className="font-bold flex items-center gap-2">
                    <ListChecks size={20} /> Danh sách câu hỏi
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center justify-center gap-2 text-blue-600 font-bold">
                    <Clock size={18} />
                    <Countdown exam={sessionExam} onComplete={handleSubmit} />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <ExamNumber
                    totalQuestions={
                      questionList.filter((q) => q.type !== "MQ")?.length
                    }
                    onSubmit={handleSubmit}
                    onSelect={handleSelectQuestion}
                    hasStarted={true}
                    answers={answers}
                    currentQuestion={currentQuestion}
                    questionList={questionList}
                    loadingAPI={loadingAPI}
                  />
                </div>
                 
                 <div className="p-4 bg-white border-t border-gray-100">
                     <button
                        onClick={handleSubmit}
                         disabled={loadingAPI}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                     >
                         {loadingAPI ? "Đang nộp..." : "Nộp bài"}
                     </button>
                 </div>

              </div>
            </div>
          </>
      </div>
    </div>
  );
};

export default ExamTestPage;
