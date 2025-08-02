import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getExamDetail } from "../../../services/ExamService";
import { isNumeric } from "../../../common/Utils";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Loading from "../../Loading";
import { postTest } from "../../../services/TestService";
import moment from "moment";

// Import các component mới
import {
  ExamHeader,
  ExamNavigation,
  ExamInfoPanel,
  ExamFixedInfoPanel,
  ExamQuestion,
  ExamModals,
} from "./components";
const user = { name: "Nguyễn Văn A" };
const totalTime = 60 * 60; // 60 phút

// Tạo storage key dựa trên examId và userId
const getStorageKey = (examId, examRoomId) => {
  return `exam_answers_${examId}_${examRoomId}`;
};

// Tạo storage key cho thời gian
const getTimeStorageKey = (examId, examRoomId) => {
  return `exam_time_${examId}_${examRoomId}`;
};

// Tạo storage key cho câu hỏi đánh dấu
const getMarkedQuestionsStorageKey = (examId, examRoomId) => {
  return `exam_marked_questions_${examId}_${examRoomId}`;
};

// Thêm hàm lưu và lấy current index vào sessionStorage
const getCurrentQuestionKey = (examId, examRoomId) =>
  `exam_current_${examId}_${examRoomId}`;

const saveCurrentToStorage = (examId, examRoomId, current) => {
  try {
    sessionStorage.setItem(
      getCurrentQuestionKey(examId, examRoomId),
      current.toString()
    );
  } catch (e) {}
};
const getCurrentFromStorage = (examId, examRoomId) => {
  try {
    const val = sessionStorage.getItem(
      getCurrentQuestionKey(examId, examRoomId)
    );
    if (val !== null) return parseInt(val, 10);
    return 0;
  } catch (e) {
    return 0;
  }
};

// Lưu đáp án vào sessionStorage
const saveAnswersToStorage = (examId, examRoomId, answers) => {
  try {
    const storageKey = getStorageKey(examId, examRoomId);
    sessionStorage.setItem(storageKey, JSON.stringify(answers));
    console.log("Saved answers to sessionStorage:", answers);
  } catch (error) {
    console.error("Error saving answers to sessionStorage:", error);
  }
};

// Lưu câu hỏi đánh dấu vào sessionStorage
const saveMarkedQuestionsToStorage = (examId, examRoomId, markedQuestions) => {
  try {
    const markedQuestionsStorageKey = getMarkedQuestionsStorageKey(
      examId,
      examRoomId
    );
    sessionStorage.setItem(
      markedQuestionsStorageKey,
      JSON.stringify(markedQuestions)
    );
    console.log("Saved marked questions to sessionStorage:", markedQuestions);
  } catch (error) {
    console.error("Error saving marked questions to sessionStorage:", error);
  }
};

// Lấy đáp án từ sessionStorage
const getAnswersFromStorage = (examId, examRoomId) => {
  try {
    const storageKey = getStorageKey(examId, examRoomId);
    const savedAnswers = sessionStorage.getItem(storageKey);
    if (savedAnswers) {
      return JSON.parse(savedAnswers);
    }
    return null;
  } catch (error) {
    console.error("Error getting answers from sessionStorage:", error);
    return null;
  }
};

// Lấy thời gian từ sessionStorage
const getTimeFromStorage = (examId, examRoomId) => {
  try {
    const timeStorageKey = getTimeStorageKey(examId, examRoomId);
    const savedTime = sessionStorage.getItem(timeStorageKey);
    if (savedTime) {
      return parseInt(savedTime, 10);
    }
    return null;
  } catch (error) {
    console.error("Error getting time from sessionStorage:", error);
    return null;
  }
};

// Lấy câu hỏi đánh dấu từ sessionStorage
const getMarkedQuestionsFromStorage = (examId, examRoomId) => {
  try {
    const markedQuestionsStorageKey = getMarkedQuestionsStorageKey(
      examId,
      examRoomId
    );
    const savedMarkedQuestions = sessionStorage.getItem(
      markedQuestionsStorageKey
    );
    if (savedMarkedQuestions) {
      return JSON.parse(savedMarkedQuestions);
    }
    return [];
  } catch (error) {
    console.error("Error getting marked questions from sessionStorage:", error);
    return [];
  }
};

function formatTime(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const ExamTestPage = () => {
  const [searchParams] = useSearchParams();
  const examRoomId = searchParams.get("examRoomId");
  const { id } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsMQ, setQuestionsMQ] = useState([]);
  const [answers, setAnswers] = useState({});
  // Mảng lưu trữ các câu hỏi được đánh dấu để làm sau
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [currentMQ, setCurrentMQ] = useState(0);
  const [currentRange, setCurrentRange] = useState([]);
  const [current, setCurrent] = useState(() =>
    getCurrentFromStorage(id, examRoomId)
  );
  const findQuestionMQ = questionsMQ.find((e) =>
    e?.range.includes(currentMQ == 0 ? currentMQ + 1 : currentMQ)
  );

  // Logic disabled cho navigation buttons - Đơn giản theo index tuần tự
  let isDisabledNext = current >= questions.length - 1; // Disable khi ở câu hỏi cuối cùng
  let isDisabledBack = current <= 0; // Disable khi ở câu hỏi đầu tiên
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [shouldPromptFullscreen, setShouldPromptFullscreen] = useState(true);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const responseExam = await getExamDetail(id, examRoomId);
      const examData = responseExam?.data;
      if (examData) {
        setExamData(examData);
        setQuestions(examData?.questions.filter((q) => q.type !== "MQ"));
        setQuestionsMQ(examData?.questions.filter((q) => q.type === "MQ"));

        // Kiểm tra xem có đáp án đã lưu trong sessionStorage không
        const savedAnswers = getAnswersFromStorage(id, examRoomId);

        // Lấy danh sách câu hỏi đã đánh dấu từ sessionStorage
        const savedMarkedQuestions = getMarkedQuestionsFromStorage(
          id,
          examRoomId
        );
        setMarkedQuestions(savedMarkedQuestions);

        if (savedAnswers) {
          console.log("Found saved answers in sessionStorage:", savedAnswers);
          setAnswers(savedAnswers);
          // Hiển thị thông báo đã tìm thấy bài làm đã lưu
          toast.success("Đã tải lại bài làm đã lưu của bạn", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          // Initialize answers object based on question types
          const initialAnswers = {};
          examData?.questions?.forEach((q) => {
            if (!q.question) {
              console.error("Question missing question property:", q);
              return;
            }

            switch (q.type) {
              case "TN":
                initialAnswers[q.question] = null;
                break;
              case "MA":
                initialAnswers[q.question] = [];
                break;
              case "DS":
                initialAnswers[q.question] = {};
                break;
              case "TLN":
                initialAnswers[q.question] = "";
                break;
              case "TLN_M":
                initialAnswers[q.question] = {
                  "1.": "",
                  "2.": "",
                  "3.": "",
                  "4.": "",
                  "5.": "",
                };
                break;
              case "KT":
                initialAnswers[q.question] = {
                  slot1: null,
                  slot2: null,
                  slot3: null,
                  slot4: null,
                  slot5: null,
                };
                break;
              default:
                if (q.type !== "MQ") {
                  initialAnswers[q.question] = null;
                }
            }
          });

          console.log("Initial answers:", initialAnswers);
          setAnswers(initialAnswers);
        }
      }
    } catch (error) {
      console.log("handleFetch ~ error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
      navigate(`/courses/${error?.response?.data?.courseId}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật currentMQ dựa trên câu hỏi hiện tại
  const updateCurrentMQFromCurrentQuestion = () => {
    const currentQuestion = questions[current];
    if (!currentQuestion) return;

    const currentQuestionNumber = parseInt(
      currentQuestion.question.match(/\d+/)?.[0] || "0"
    );

    // Kiểm tra xem câu hỏi có thuộc MQ group không
    const sortedMQGroups = questionsMQ.sort((a, b) => a.range[0] - b.range[0]);
    const mqGroup = sortedMQGroups.find((e) =>
      e?.range.includes(currentQuestionNumber)
    );

    if (mqGroup) {
      // Nếu thuộc MQ group, set currentMQ = question number
      setCurrentMQ(currentQuestionNumber);
    } else {
      // Nếu không thuộc MQ group (câu hỏi bình thường), set currentMQ = 0
      setCurrentMQ(0);
    }
  };

  useEffect(() => {
    handleFetch();
    // Khi examId hoặc examRoomId đổi, reset current về giá trị đã lưu (nếu có)
    const savedCurrent = getCurrentFromStorage(id, examRoomId);
    setCurrent(savedCurrent);
  }, [id, examRoomId]);

  // Cập nhật currentMQ khi current hoặc questions thay đổi
  useEffect(() => {
    if (questions.length > 0) {
      updateCurrentMQFromCurrentQuestion();
    }
  }, [current, questions, questionsMQ]);

  // Lưu đáp án vào sessionStorage mỗi khi answers thay đổi
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      saveAnswersToStorage(id, examRoomId, answers);
    }
  }, [answers, id, examRoomId]);

  // Lưu current vào sessionStorage mỗi khi current thay đổi
  useEffect(() => {
    saveCurrentToStorage(id, examRoomId, current);
  }, [current, id, examRoomId]);

  // useEffect KHÔNG gọi requestFullscreen trực tiếp nữa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (!isFullscreen) {
        setShowFullscreenModal(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleBackToFullscreen = () => {
    setShowFullscreenModal(false);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  useEffect(() => {
    const handleKeyEvent = (e) => {
      // Print Screen (keyCode 44)
      if (e.keyCode === 44) {
        handleScreenshotAttempt();
        return;
      }

      // Alt + Print Screen
      if (e.altKey && e.keyCode === 44) {
        handleScreenshotAttempt();
        return;
      }

      // Windows + Shift + S (Snipping Tool)
      if (e.metaKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        handleScreenshotAttempt();
        return;
      }

      // Ctrl + Shift + I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        handleScreenshotAttempt();
        return;
      }
    };

    const handleScreenshotAttempt = () => {
      const effects = [
        createRedWarningOverlay,
        createBlackScreenOverlay,
        createBlurOverlay,
      ];

      // Chọn ngẫu nhiên một hiệu ứng
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      randomEffect();
    };

    const createRedWarningOverlay = () => {
      const overlay = document.createElement("div");
      overlay.id = "screenshot-blocker";
      overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #ff0000;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: flashRed 0.2s infinite;
  `;

      overlay.innerHTML = `
    <div style="color: white; font-size: 60px; font-weight: bold; text-align: center;">
      🚫 CHỤP MÀN HÌNH BỊ CHẶN 🚫
    </div>
  `;

      addOverlayStyles();
      document.body.appendChild(overlay);
      removeOverlayAfterDelay(overlay);
    };

    const createBlackScreenOverlay = () => {
      const overlay = document.createElement("div");
      overlay.id = "screenshot-blocker";
      overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000000;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

      overlay.innerHTML = `
    <div style="color: #ff0000; font-size: 40px; font-weight: bold; text-align: center; animation: pulse 1s infinite;">
      ⚠️ NỘI DUNG ĐƯỢC BẢO VỆ ⚠️<br>
      <div style="font-size: 20px; margin-top: 20px; color: white;">
        Không thể chụp màn hình
      </div>
    </div>
  `;

      addOverlayStyles();
      document.body.appendChild(overlay);
      removeOverlayAfterDelay(overlay);
    };

    const createBlurOverlay = () => {
      // Làm mờ toàn bộ body
      document.body.style.filter = "blur(20px)";
      document.body.style.transition = "filter 0.1s";

      const overlay = document.createElement("div");
      overlay.id = "screenshot-blocker";
      overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.9);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

      overlay.innerHTML = `
    <div style="color: #ff0000; font-size: 50px; font-weight: bold; text-align: center;">
      🔒 NỘI DUNG BỊ CHE 🔒
    </div>
  `;

      document.body.appendChild(overlay);

      setTimeout(() => {
        document.body.style.filter = "none";
        if (document.getElementById("screenshot-blocker")) {
          document.body.removeChild(overlay);
        }
      }, 3000);
    };

    const addOverlayStyles = () => {
      if (!document.getElementById("overlay-styles")) {
        const style = document.createElement("style");
        style.id = "overlay-styles";
        style.textContent = `
      @keyframes flashRed {
        0% { background: #ff0000; }
        50% { background: #990000; }
        100% { background: #ff0000; }
      }

      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes staticNoise {
        0% { opacity: 1; }
        25% { opacity: 0.8; }
        50% { opacity: 0.6; }
        75% { opacity: 0.9; }
        100% { opacity: 1; }
      }
    `;
        document.head.appendChild(style);
      }
    };

    const removeOverlayAfterDelay = (overlay, delay = 3000) => {
      setTimeout(() => {
        if (document.getElementById("screenshot-blocker")) {
          document.body.removeChild(overlay);
        }
      }, delay);
    };

    document.addEventListener("keydown", handleKeyEvent);
    document.addEventListener("keyup", handleKeyEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
      document.removeEventListener("keyup", handleKeyEvent);

      // Cleanup overlay nếu component unmount
      const overlay = document.getElementById("screenshot-blocker");
      if (overlay) {
        document.body.removeChild(overlay);
      }
    };
  }, [id, examRoomId, current]);

  const handleSelect = (value, sub, q) => {
    if (!q || !q.question) {
      console.error("Invalid question object:", q);
      return;
    }

    // Ngăn chặn scroll khi đang xử lý answer
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    const questionNumber = q.question;
    console.log("handleSelect called with:", {
      value,
      questionNumber,
      questionType: q.type,
    });

    switch (q.type) {
      case "TN":
        // Force re-render by creating a new state object
        setAnswers((prev) => {
          const newState = { ...prev };
          newState[questionNumber] = value;
          return newState;
        });
        break;
      case "MA":
        setAnswers((prev) => {
          const currentAnswers = prev[questionNumber] || [];
          const newAnswers = currentAnswers.includes(value)
            ? currentAnswers.filter((a) => a !== value)
            : [...currentAnswers, value];
          return {
            ...prev,
            [questionNumber]: newAnswers,
          };
        });
        break;
      case "DS":
        setAnswers((prev) => ({
          ...prev,
          [questionNumber]: {
            ...prev[questionNumber],
            ...value,
          },
        }));
        break;
      case "TLN":
        // Parse number if possible, otherwise keep as string
        let numericValue = value;
        if (typeof value === "string" && value.includes(",")) {
          numericValue = numericValue.replace(",", ".");
        }

        if (isNumeric(numericValue)) {
          numericValue = parseFloat(numericValue);
          setAnswers((prev) => ({
            ...prev,
            [questionNumber]: numericValue,
          }));
        } else {
          setAnswers((prev) => ({
            ...prev,
            [questionNumber]: value,
          }));
        }

        break;
      case "TLN_M":
        {
          // Parse number if possible, otherwise keep as string
          let numericValue = value;

          if (typeof value === "string" && value.includes(",")) {
            numericValue = numericValue.replace(",", ".");
          }

          if (isNumeric(numericValue)) {
            numericValue = parseFloat(numericValue);
            setAnswers((prev) => ({
              ...prev,
              [questionNumber]: {
                ...prev[questionNumber],
                [sub.key]: numericValue,
              },
            }));
          } else {
            setAnswers((prev) => ({
              ...prev,
              [questionNumber]: {
                ...prev[questionNumber],
                [sub.key]: value,
              },
            }));
          }
        }
        break;
      default:
        break;
    }

    // Khôi phục scroll position sau khi xử lý
    setTimeout(() => {
      window.scrollTo(0, currentScrollTop);
    }, 0);
  };

  // Hàm scroll an toàn không gây vệt trắng
  const scrollToQuestion = (questionIndex) => {
    // Lấy question để check số thứ tự
    const targetQuestion = questions[questionIndex];
    if (!targetQuestion) return;

    const questionNumber = parseInt(
      targetQuestion.question.match(/\d+/)?.[0] || "0"
    );
    const currentQuestionMQ = questionsMQ.find((e) =>
      e?.range.includes(questionNumber)
    );

    if (currentQuestionMQ) {
      // Scroll cho MQ questions
      setTimeout(() => {
        const element = document.getElementById(`question-${questionIndex}`);
        if (element) {
          const container = element.closest(".overflow-y-auto");

          if (container) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            const isAbove = elementRect.top < containerRect.top;
            const isBelow = elementRect.bottom > containerRect.bottom;

            if (isAbove || isBelow) {
              const scrollTopDelta =
                element.offsetTop -
                container.offsetTop -
                container.clientHeight / 3;

              container.scrollTo({
                top: scrollTopDelta,
                behavior: "smooth", // Vẫn giữ mượt nhưng không phụ thuộc scrollIntoView
              });
            }
          }
        }
      }, 100);
    }
    // Non-MQ questions không cần scroll vì chúng fullscreen
  };

  // Hàm điều hướng cho nút Previous/Next - Navigation tuần tự theo index
  const handleNav = (idx, isNext) => {
    console.log("handleNav called with idx:", idx, "isNext:", isNext);

    if (isNext) {
      // Next: chuyển sang câu hỏi tiếp theo trong array
      const nextIndex = current + 1;
      if (nextIndex < questions.length) {
        const nextQuestion = questions[nextIndex];
        const nextQuestionNumber = parseInt(
          nextQuestion.question.match(/\d+/)?.[0] || "0"
        );

        // Tìm tất cả các MQ groups
        const sortedMQGroups = questionsMQ.sort(
          (a, b) => a.range[0] - b.range[0]
        );

        // Kiểm tra câu hỏi tiếp theo có thuộc MQ group không
        const nextMQGroup = sortedMQGroups.find((e) =>
          e?.range.includes(nextQuestionNumber)
        );

        setCurrent(nextIndex);

        if (nextMQGroup) {
          // Câu tiếp theo thuộc MQ group
          setCurrentMQ(nextQuestionNumber);
          console.log(
            `Next: Moving to MQ question ${nextQuestionNumber} at index ${nextIndex}`
          );
        } else {
          // Câu tiếp theo là câu bình thường
          setCurrentMQ(0);
          console.log(
            `Next: Moving to regular question ${nextQuestionNumber} at index ${nextIndex}`
          );
        }

        scrollToQuestion(nextIndex);
      }
    } else {
      // Back: chuyển sang câu hỏi trước đó trong array
      const prevIndex = current - 1;
      if (prevIndex >= 0) {
        const prevQuestion = questions[prevIndex];
        const prevQuestionNumber = parseInt(
          prevQuestion.question.match(/\d+/)?.[0] || "0"
        );

        // Tìm tất cả các MQ groups
        const sortedMQGroups = questionsMQ.sort(
          (a, b) => a.range[0] - b.range[0]
        );

        // Kiểm tra câu hỏi trước đó có thuộc MQ group không
        const prevMQGroup = sortedMQGroups.find((e) =>
          e?.range.includes(prevQuestionNumber)
        );

        setCurrent(prevIndex);

        if (prevMQGroup) {
          // Câu trước đó thuộc MQ group
          setCurrentMQ(prevQuestionNumber);
          console.log(
            `Back: Moving to MQ question ${prevQuestionNumber} at index ${prevIndex}`
          );
        } else {
          // Câu trước đó là câu bình thường
          setCurrentMQ(0);
          console.log(
            `Back: Moving to regular question ${prevQuestionNumber} at index ${prevIndex}`
          );
        }

        scrollToQuestion(prevIndex);
      }
    }
  };

  // Hàm điều hướng từ Info Panel
  const handleNavFromPanel = (idx) => {
    console.log("handleNavFromPanel called with idx:", idx);

    // Lấy câu hỏi tại index được click
    const clickedQuestion = questions[idx];
    if (!clickedQuestion) return;

    // Lấy số thứ tự câu hỏi
    const questionNumber = parseInt(
      clickedQuestion.question.match(/\d+/)?.[0] || "0"
    );

    // Tìm tất cả các MQ groups
    const sortedMQGroups = questionsMQ.sort((a, b) => a.range[0] - b.range[0]);

    // Kiểm tra xem câu hỏi này có thuộc MQ group nào không
    const mqGroup = sortedMQGroups.find((e) =>
      e?.range.includes(questionNumber)
    );

    if (mqGroup) {
      // Nếu thuộc MQ group, set currentMQ về đúng câu hỏi được click
      setCurrentMQ(questionNumber);
      setCurrent(idx); // Set current về đúng index được click
      scrollToQuestion(idx);
      console.log(`Navigated to MQ question ${questionNumber} at index ${idx}`);
    } else {
      // Nếu không thuộc MQ group, đây là câu hỏi bình thường
      setCurrent(idx);
      setCurrentMQ(0); // Reset currentMQ để đảm bảo không hiển thị UI MQ
      scrollToQuestion(idx);
      console.log(
        `Navigated to regular question at index ${idx} (question ${questionNumber})`
      );
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement exam submission
    try {
      const savedAnswers = getAnswersFromStorage(id, examRoomId);

      // Calculate the time used
      const startTime = moment(examData.start);
      const examCompledTime = sessionStorage.getItem(
        `exam_time_${id}_${examRoomId}`
      );
      const usedDurationMs =
        (JSON.parse(examCompledTime) || 0) - startTime.valueOf();
      const usedMinutes = Math.floor(usedDurationMs);

      const res = await postTest(id, {
        userAnswers: savedAnswers || {},
        examCompledTime: usedMinutes,
        examId: id,
        access: examData.access,
        examRoomId,
      });
      toast.success(res.message);

      const storageKey = getStorageKey(id, examRoomId);
      const timeStorageKey = getTimeStorageKey(id, examRoomId);
      const markedQuestionsStorageKey = getMarkedQuestionsStorageKey(
        id,
        examRoomId
      );
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(timeStorageKey);
      sessionStorage.removeItem(markedQuestionsStorageKey);
      sessionStorage.removeItem(`exam_time_${id}_${examRoomId}`);
      sessionStorage.removeItem(`current_time_${id}_${examRoomId}_${current}`);
      sessionStorage.removeItem(`exam_current_${id}_${examRoomId}`);
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key.startsWith("current_time_")) {
          sessionStorage.removeItem(key);
        }
      }
      console.log(
        "Removed answers, time and marked questions from sessionStorage after submission"
      );
      navigate(`/exam/ranking/${id}?examRoomId=${examRoomId}`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nộp bài");
    }
  };

  // Hàm kiểm tra xem câu hỏi đã được trả lời hay chưa
  const isQuestionAnswered = (question) => {
    if (!question || !answers[question.question]) {
      return false;
    }

    const answer = answers[question.question];
    let isAnswered = false;

    switch (question.type) {
      case "TN":
        // Trắc nghiệm: đã chọn một đáp án (A, B, C, D)
        isAnswered = answer !== null && answer !== undefined;
        break;

      case "MA":
        // Nhiều lựa chọn: đã chọn ít nhất một đáp án
        isAnswered = Array.isArray(answer) && answer.length > 0;
        break;

      case "DS":
        // Đúng/Sai: đã chọn ít nhất một mệnh đề
        isAnswered =
          typeof answer === "object" &&
          Object.keys(answer).length > 0 &&
          Object.values(answer).some((val) => val === "D" || val === "S");
        break;

      case "TLN":
        // Trả lời ngắn: đã nhập câu trả lời (không rỗng)
        isAnswered = answer !== null && answer !== undefined && answer !== "";
        break;

      case "TLN_M":
        // Trả lời ngắn nhiều mệnh đề: đã nhập ít nhất một câu trả lời
        if (typeof answer !== "object") {
          isAnswered = false;
        } else {
          isAnswered = Object.values(answer).some((val) => {
            // Kiểm tra giá trị hợp lệ, bỏ qua các giá trị rỗng
            return val !== null && val !== undefined && val !== "";
          });
        }
        break;

      case "KT":
        // Kéo thả: đã kéo ít nhất một item vào slot
        if (typeof answer !== "object") {
          isAnswered = false;
        } else {
          isAnswered = Object.values(answer).some(
            (val) => val !== null && val !== undefined
          );
        }
        break;

      default:
        isAnswered = false;
    }

    return isAnswered;
  };

  // Số câu hỏi đã trả lời
  const doneCount = questions.filter((q) => isQuestionAnswered(q)).length;

  const onDragEnd = (question) => (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const questionNumber = question?.question;

    // Nếu vị trí nguồn và đích giống nhau, không làm gì cả
    if (destination.droppableId === source.droppableId) {
      return;
    }

    setAnswers((prev) => {
      const currentAnswers = prev[questionNumber] || {};
      const updatedAnswers = { ...currentAnswers };

      // Nếu kéo từ slot này sang slot khác
      if (
        source.droppableId.startsWith("slot") &&
        destination.droppableId.startsWith("slot")
      ) {
        // Xóa item khỏi slot cũ
        updatedAnswers[source.droppableId] = null;
        // Thêm item vào slot mới
        updatedAnswers[destination.droppableId] = draggableId;
      }
      // Nếu kéo từ hàng items xuống slot
      else if (
        source.droppableId === "items" &&
        destination.droppableId.startsWith("slot")
      ) {
        updatedAnswers[destination.droppableId] = draggableId;
      }
      // Nếu kéo từ slot lên hàng items
      else if (
        source.droppableId.startsWith("slot") &&
        destination.droppableId === "items"
      ) {
        updatedAnswers[source.droppableId] = null;
      }

      const newState = {
        ...prev,
        [questionNumber]: updatedAnswers,
      };

      // Lưu ngay đáp án sau khi kéo thả
      saveAnswersToStorage(id, examRoomId, newState);

      return newState;
    });
  };

  // Hàm để đánh dấu hoặc bỏ đánh dấu câu hỏi
  const toggleMarkQuestion = (idx) => {
    setMarkedQuestions((prev) => {
      let newMarkedQuestions;
      if (prev.includes(idx)) {
        // Nếu câu hỏi đã được đánh dấu, bỏ đánh dấu
        newMarkedQuestions = prev.filter((q) => q !== idx);
        toast.info(`Đã bỏ đánh dấu câu ${idx + 1}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          icon: "🔖",
        });
      } else {
        // Nếu câu hỏi chưa được đánh dấu, thêm vào danh sách
        newMarkedQuestions = [...prev, idx];
        toast.success(`Đã đánh dấu câu ${idx + 1} để làm sau`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          icon: "🔖",
        });
      }

      // Lưu danh sách đánh dấu vào sessionStorage
      saveMarkedQuestionsToStorage(id, examRoomId, newMarkedQuestions);

      return newMarkedQuestions;
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fa]">
      {/* Header */}
      <ExamHeader examData={examData} />

      {/* Main Content */}
      <div className="flex-1 flex gap-0 max-w-full mx-auto w-full relative overflow-hidden h-[calc(100vh-64px)]">
        {/* Main Question Area */}
        <div
          className="flex flex-col flex-1 px-2 py-3 overflow-hidden md:px-3 md:py-4"
          style={{ scrollBehavior: "auto" }}
        >
          <ExamQuestion
            questions={questions}
            questionsMQ={questionsMQ}
            current={current}
            currentMQ={currentMQ}
            answers={answers}
            markedQuestions={markedQuestions}
            toggleMarkQuestion={toggleMarkQuestion}
            handleSelect={handleSelect}
            onDragEnd={onDragEnd}
            isQuestionAnswered={isQuestionAnswered}
          />

          {/* Navigation Footer */}
          <ExamNavigation
            current={current}
            isDisabledBack={isDisabledBack}
            isDisabledNext={isDisabledNext}
            handleNav={handleNav}
            examData={examData}
            examRoomId={examRoomId}
            handleSubmit={handleSubmit}
            setShowInfoPanel={setShowInfoPanel}
            showInfoPanel={showInfoPanel}
          />

          {/* Slide-out Info Panel */}
          <ExamInfoPanel
            showInfoPanel={showInfoPanel}
            setShowInfoPanel={setShowInfoPanel}
            examData={examData}
            examRoomId={examRoomId}
            handleSubmit={handleSubmit}
            questions={questions}
            current={current}
            currentMQ={currentMQ}
            questionsMQ={questionsMQ}
            isQuestionAnswered={isQuestionAnswered}
            markedQuestions={markedQuestions}
            handleNavFromPanel={handleNavFromPanel}
            doneCount={doneCount}
          />
        </div>

        {/* Fixed Info Panel - chỉ hiện khi không phải câu hỏi MQ */}
        <ExamFixedInfoPanel
          currentMQ={currentMQ}
          questionsMQ={questionsMQ}
          examData={examData}
          examRoomId={examRoomId}
          handleSubmit={handleSubmit}
          questions={questions}
          current={current}
          isQuestionAnswered={isQuestionAnswered}
          markedQuestions={markedQuestions}
          handleNavFromPanel={handleNavFromPanel}
          doneCount={doneCount}
        />
      </div>

      {/* Modals */}
      <ExamModals
        showFullscreenModal={showFullscreenModal}
        shouldPromptFullscreen={shouldPromptFullscreen}
        setShouldPromptFullscreen={setShouldPromptFullscreen}
        handleBackToFullscreen={handleBackToFullscreen}
      />
    </div>
  );
};

export default ExamTestPage;
