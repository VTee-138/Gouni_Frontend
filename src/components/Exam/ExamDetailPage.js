import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import TestMA from "./ExamTest/TestMA";
import { getExamDetail } from "../../services/ExamService";
import { postTest } from "../../services/TestService";
import Loading from "../Loading";
import Header from "../Header/Header";
import Countdown from "./ExamTest/Countdown";
import ExamNumber from "./ExamTest/ExamNumber";
import MathRenderer from "../../common/MathRenderer";
import TestTN from "./ExamTest/TestTN";
import TestDS from "./ExamTest/TestDS";
import TestKT from "./ExamTest/TestKT";
import TestTLN from "./ExamTest/TestTLN";
import TestTLN_M from "./ExamTest/TestTLN_M";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import ExamInfo from "./ExamInfo";

const STORAGE_KEY = "exam-answers";
const CURRENT_QUESTION_KEY = "current-question";

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDesktop992 = useMediaQuery("(max-width:992px)");
  const isDesktop768 = useMediaQuery("(max-width:768px)");
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [hasStarted, setHasStarted] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [answers, setAnswers] = useState({});
  const start = sessionStorage.getItem("exam");
  const [questions, setQuestions] = useState(examData?.questions || []);
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

  const questionList = useMemo(() => {
    if (!examData) return [];
    return examData?.questions.filter((q) => q.type !== "MQ") || [];
  }, [examData]);

  const questionListMQ = useMemo(() => {
    if (!examData) return [];

    // Sử dụng biểu thức chính quy để tìm số câu hỏi trong currentQuestion
    const match = currentQuestion?.match(/Câu\s*hỏi\s*(\d+)/);
    const currentQuestionNumber = match ? parseInt(match[1], 10) : null;

    return (
      examData?.questions
        .filter((q) => q.type === "MQ")
        .map((q) => {
          // Kiểm tra nếu currentQuestionNumber có trong range
          if (
            q.range.some((rangeItem) => rangeItem === currentQuestionNumber)
          ) {
            return {
              ...q,
              showContent: true, // Thêm thuộc tính để hiển thị contentQuestions
            };
          }
          return q;
        }) || []
    );
  }, [examData, currentQuestion]);

  const isEmptyObject = (obj) => {
    return obj && typeof obj === "object" && Object.keys(obj).length === 0;
  };

  const handleStartExam = () => {
    if (examData) {
      sessionStorage.setItem(
        "exam",
        JSON.stringify({
          _id: examData._id,
          time: examData.time,
          start: moment(new Date()),
        })
      );
      setHasStarted(true);
      const firstNonMQQuestion = examData?.questions?.find(
        (q) => q.type !== "MQ"
      );

      setCurrentQuestion(firstNonMQQuestion.question);
    }
  };

  const handleSelectQuestion = (index) => {
    sessionStorage.setItem(
      CURRENT_QUESTION_KEY,
      questionList?.[index]?.question
    );
    setCurrentQuestion(questionList?.[index]?.question);
  };

  useEffect(() => {
    setQuestions(examData?.questions);
  }, [examData?.questions, id]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    // Tìm câu hỏi tương ứng với droppableId
    const question = questions.find((e) => e.question === source.droppableId);

    // Nếu không tìm thấy câu hỏi, return
    if (!question) return;

    // Lấy draggedItem từ danh sách items
    const draggedItem = question.items[source.index];

    // Kiểm tra nếu draggedItem tồn tại
    if (!draggedItem) {
      console.error("Dragged item not found");
      return;
    }

    // Nếu thả vào ô trống (slot)
    if (destination.droppableId.startsWith("slot")) {
      const slotKey = destination.droppableId;
      const previousItemInSlot = question.answers[slotKey];

      // Cập nhật lại câu hỏi khi kéo thả
      setQuestions((prevQuestions) => {
        const updatedQuestions = prevQuestions.map((q) => {
          if (q.question === question.question) {
            const updatedQuestion = { ...q };
            updatedQuestion.answers[slotKey] = draggedItem;

            updatedQuestion.items = updatedQuestion.items.filter(
              (item) => item?.id !== draggedItem?.id
            );

            if (previousItemInSlot) {
              updatedQuestion.items.push(previousItemInSlot);
            }

            const output = Object.keys(updatedQuestion.answers).reduce(
              (acc, key) => {
                const slot = updatedQuestion.answers[key];
                if (slot && slot.id) {
                  acc[key] = slot.id;
                } else {
                  acc[key] = null;
                }
                return acc;
              },
              {}
            );
            const updatedAnswers = {
              ...answers,
              [currentQuestion]: output,
            };
            setAnswers(updatedAnswers);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnswers));
            return updatedQuestion;
          }
          return q;
        });

        return updatedQuestions;
      });
    }
  };

  function isNumeric(numericValue) {
    if (numericValue === 0) return true;
    if (!numericValue) return false;
    if (typeof numericValue === "string" && numericValue.includes(",")) {
      numericValue = numericValue.replace(",", ".");
    }
    return !isNaN(numericValue) && !isNaN(parseFloat(numericValue));
  }

  const handleChangeUserAnswersTLN = (event) => {
    const { name, value } = event.target;

    if (!value || value === "-") {
      setAnswers((prevAnswers) => {
        const newAnswer = {
          ...prevAnswers,
          [name]: value,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswer));
        return newAnswer;
      });
      return;
    }

    let numericValue = value;

    if (typeof numericValue === "string" && numericValue.includes(",")) {
      numericValue = numericValue.replace(",", ".");
    }

    if (isNumeric(numericValue)) {
      setAnswers((prevAnswers) => {
        const newAnswer = {
          ...prevAnswers,
          [name]: numericValue,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswer));
        return newAnswer;
      });
    }
  };

  const handleChangeUserAnswersTLN_M = (event) => {
    const { name, value } = event.target;
    let temp = name.split("-");
    if (!value || value === "-") {
      setAnswers((prevAnswers) => {
        let newAnswer = {};
        if (prevAnswers?.[temp[0]]) {
          newAnswer = {
            ...prevAnswers,
            [temp[0]]: { ...prevAnswers[temp[0]], [temp[1]]: value }, // Lưu giá trị dưới dạng số
          };
        } else {
          newAnswer = {
            ...prevAnswers,
            [temp[0]]: { [temp[1]]: value }, // Lưu giá trị dưới dạng số
          };
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswer));
        return newAnswer;
      });
    }
    let numericValue = value;
    if (typeof numericValue === "string" && numericValue.includes(",")) {
      numericValue = numericValue.replace(",", ".");
    }
    if (isNumeric(numericValue)) {
      setAnswers((prevAnswers) => {
        let newAnswer = {};
        if (prevAnswers?.[temp[0]]) {
          newAnswer = {
            ...prevAnswers,
            [temp[0]]: { ...prevAnswers[temp[0]], [temp[1]]: numericValue }, // Lưu giá trị dưới dạng số
          };
        } else {
          newAnswer = {
            ...prevAnswers,
            [temp[0]]: { [temp[1]]: numericValue }, // Lưu giá trị dưới dạng số
          };
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswer));
        return newAnswer;
      });
    }
  };

  const handleChangeUserAnswersMA = (e, name, question) => {
    setAnswers((prevAnswers) => {
      let uniqueArray = [];
      if (e.target.checked) {
        if (Array.isArray(prevAnswers[question])) {
          prevAnswers[question]?.push(name);
        } else {
          prevAnswers[question] = [name];
        }
      }
      uniqueArray = [...new Set(prevAnswers[question])];
      const newAnswer = {
        ...prevAnswers,
        [question]: e.target.checked
          ? uniqueArray
          : uniqueArray.filter((ittem) => ittem !== name),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswer));
      return newAnswer;
    });
  };

  const handleSelectAnswer = (value, type) => {
    if (type === "DS") {
      setAnswers(value);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else if (type === "TN") {
      const updatedAnswers = {
        ...answers,
        [currentQuestion]: value,
      };
      const cleanedAnswers = Object.fromEntries(
        Object.entries(updatedAnswers).filter(
          ([_, v]) => v !== null && v !== undefined
        )
      );
      setAnswers(cleanedAnswers);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedAnswers));
    }
  };

  // const [examCompledTime, setExamCompledTime] = useState(0);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoadingAPI(true);
      const savedAnswers = getJSONFromSession("exam-answers");
      const examCompledTime = getJSONFromSession("time-left");
      const res = await postTest(id, {
        userAnswers: JSON.parse(savedAnswers) || {},
        examCompledTime: JSON.parse(examCompledTime),
        examId: id,
        access: examData.access,
        examRoomId,
      });
      toast.success(res.message);
      navigate(`/exam/ranking/${id}?examRoomId=${examRoomId}`);
      sessionStorage.removeItem(STORAGE_KEY);
      setLoadingAPI(false);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      setLoadingAPI(false);
    }
  };

  const getJSONFromSession = (key) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? item : null;
    } catch (err) {
      console.error(`Failed to parse sessionStorage key: ${key}`, err);
      return null;
    }
  };

  const getJSONFromLocal = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`Failed to parse sessionStorage key: ${key}`, err);
      return null;
    }
  };

  const savedAnswers = getJSONFromSession("exam-answers");
  const current = questionList
    .filter((item) => item.type !== "MQ")
    ?.find?.((q) => q.question === currentQuestion);
  const sessionExam = JSON.parse(sessionStorage.getItem("exam"));
  const savedQuestion = getJSONFromSession(CURRENT_QUESTION_KEY);

  useEffect(() => {
    setHasStarted(!!start);
  }, [start, id]);

  useEffect(() => {
    setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
  }, [savedAnswers, id]);
  useEffect(() => {
    if (examData && !examData?.active) {
      toast.warning("Đề chưa được mở.", { autoClose: 2000 });
      navigate(`/`);
    }
  }, [examData, navigate]);

  useEffect(() => {
    if (savedQuestion) {
      setCurrentQuestion(savedQuestion);
      sessionStorage.setItem(CURRENT_QUESTION_KEY, savedQuestion);
    }
  }, [savedQuestion, id]);

  useEffect(() => {
    const firstNonMQQuestion = examData?.questions?.find(
      (q) => q.type !== "MQ"
    );

    if (firstNonMQQuestion && !savedQuestion) {
      setCurrentQuestion(firstNonMQQuestion.question);
      sessionStorage.setItem(CURRENT_QUESTION_KEY, firstNonMQQuestion.question);
    }
  }, [examData, id, savedQuestion]);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Đảo trạng thái đóng/mở khi click
  };

  if (loading) return <Loading />;

  return (
    <Stack
    // sx={{
    //   margin: isDesktop768
    //     ? "10px 20px 20px"
    //     : isDesktop992
    //     ? "20px 40px 40px"
    //     : "40px 80px 80px",
    // }}
    // direction={"column"}
    // gap={"40px"}
    >
      <Header />
      <Stack
        direction={"row"}
        gap={"20px"}
        justifyContent={"flex-start"}
        sx={{ position: "relative", maxWidth: "100%" }}
        className="z-[98] px-4 sm:px-6 lg:px-[10rem] py-3 sm:py-4"
      >
        <Stack
          sx={{
            width: "300px",
            gap: "10px",
            position: isDesktop992 ? "fixed" : "unset",
            background: "white",
            zIndex: "99",
            bottom: "0",
            right: "20px",
            boxShadow: "0px 2px 20px 20px rgb(0 0 0 / 5%);",
            borderRadius: "10px",
            height: "fit-content",
            opacity: isDesktop992 ? (isOpen ? "1" : "0") : "1",
            visibility: isDesktop992
              ? isOpen
                ? "visible"
                : "hidden"
              : "visible",
          }}
        >
          {isOpen && isDesktop992 && (
            <Stack
              sx={{
                padding: "10px",
                bgcolor: "#cd1628",
                whiteSpace: "nowrap",
                height: "fit-content",
                color: "white",
                cursor: "pointer",
              }}
              onClick={toggleSidebar}
              flexDirection={"row"}
              gap={"10px"}
            >
              <CloseIcon sx={{ color: "white" }} />
              <Typography>Đóng phiếu điền</Typography>
            </Stack>
          )}
          {hasStarted && (
            <Countdown exam={sessionExam} onComplete={handleSubmit} />
          )}

          <ExamNumber
            totalQuestions={questionList.filter((q) => q.type !== "MQ")?.length}
            onSubmit={handleSubmit}
            onSelect={handleSelectQuestion}
            hasStarted={hasStarted}
            answers={answers}
            currentQuestion={currentQuestion}
            questionList={questionList}
            loadingAPI={loadingAPI}
          />
        </Stack>
        {isDesktop992 && (
          <Stack>
            {!isOpen && (
              <Stack
                sx={{
                  position: "absolute",
                  bottom: "100px",
                  right: "10px",
                  zIndex: 100,
                  padding: "10px",
                  bgcolor: "#cd1628",
                  whiteSpace: "nowrap",
                  height: "fit-content",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={toggleSidebar}
                flexDirection={"row"}
                gap={"10px"}
              >
                <ArrowForward sx={{ color: "white" }} />
                <Typography>Mở phiếu điền</Typography>
              </Stack>
            )}
          </Stack>
        )}

        <Stack
          sx={{
            width: isDesktop992 ? "100%" : "73%",
            bgcolor: "white",
            height: "fit-content",
            padding: "20px",
            borderRadius: "10px",
            gap: "20px",
            transition: "width 300ms ease-in-out",
            boxShadow: "0px 2px 20px 20px rgb(0 0 0 / 5%)",
          }}
        >
          {!hasStarted && (
            <Typography
              sx={{
                fontSize: "20px",
                whiteSpace: "pre-line",
              }}
            >
              <ExamInfo handleStartExam={handleStartExam} examData={examData} />
            </Typography>
          )}

          {/* {!hasStarted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartExam}
              sx={{
                width: "200px",
                backgroundColor: "#cd1628",
                transition: "all 200ms ease-in-out",
                ":hover": {
                  backgroundColor: "#cd1628",
                  opacity: 0.8,
                },
                fontSize: "16px",
              }}
            >
              Bắt đầu làm bài
            </Button>
          )} */}
          {hasStarted && (
            <Stack
              direction={"column"}
              gap={"10px"}
              sx={{
                "& div div": {
                  fontSize: "18px",
                },
              }}
            >
              {questionListMQ.map(
                (question, index) =>
                  question.showContent && (
                    <div key={index}>
                      <Typography
                        fontSize={20}
                        fontWeight={700}
                        sx={{
                          fontStyle: "italic",
                        }}
                      >
                        {question.title}
                      </Typography>
                      <MathRenderer
                        content={question.contentQuestions}
                      ></MathRenderer>
                      <Stack alignItems={"center"}>
                        <img
                          src={question?.imageUrl}
                          style={{
                            objectFit: "cover",
                          }}
                          className="max-w-full h-auto"
                        ></img>
                      </Stack>
                    </div>
                  )
              )}
              <Typography fontSize={20} fontWeight={600}>
                {currentQuestion}:
              </Typography>
              <Box width={"100%"} bgcolor="#fff" borderRadius="10px">
                <Stack>
                  <Stack direction={"row"} gap={"20px"}>
                    <Stack
                      sx={{
                        flex: "1",
                        "& div": {
                          fontSize: "18px",
                        },
                      }}
                    >
                      <MathRenderer
                        content={current?.contentQuestions}
                      ></MathRenderer>
                    </Stack>
                  </Stack>
                  <Stack alignItems={"center"}>
                    <img
                      src={current?.imageUrl}
                      style={{
                        objectFit: "cover",
                      }}
                      className="max-w-full h-auto"
                    ></img>
                  </Stack>
                </Stack>
                {current?.type === "TN" && (
                  <TestTN
                    answers={answers}
                    currentQuestion={currentQuestion}
                    handleSelectAnswer={handleSelectAnswer}
                    current={current}
                  ></TestTN>
                )}
                {current?.type === "DS" && (
                  <TestDS
                    answers={answers}
                    currentQuestion={currentQuestion}
                    handleSelectAnswer={handleSelectAnswer}
                    current={current}
                  ></TestDS>
                )}
                {current?.type === "KT" && (
                  <TestKT
                    key={currentQuestion}
                    answers={answers}
                    currentQuestion={currentQuestion}
                    handleSelectAnswer={handleSelectAnswer}
                    onDragEnd={onDragEnd}
                    q={questions?.find((q) => q.question === currentQuestion)}
                  ></TestKT>
                )}
                {current?.type === "TLN" && (
                  <TestTLN
                    question={currentQuestion}
                    answers={answers}
                    handleChangeUserAnswersTLN={handleChangeUserAnswersTLN}
                  ></TestTLN>
                )}
                {current?.type === "TLN_M" && (
                  <TestTLN_M
                    question={currentQuestion}
                    answers={answers}
                    q={current}
                    handleChangeUserAnswersTLN_M={handleChangeUserAnswersTLN_M}
                  ></TestTLN_M>
                )}
                {current?.type === "MA" && (
                  <TestMA
                    question={currentQuestion}
                    answers={answers}
                    q={current}
                    handleChangeUserAnswersMA={handleChangeUserAnswersMA}
                  ></TestMA>
                )}
              </Box>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    const currentIndex = questionList?.findIndex(
                      (q) => q.question === currentQuestion
                    );
                    const prevIndex = Math.max(0, currentIndex - 1);
                    setCurrentQuestion(questionList[prevIndex].question);
                    sessionStorage.setItem(
                      CURRENT_QUESTION_KEY,
                      questionList[prevIndex].question
                    );
                  }}
                  disabled={currentQuestion === questionList?.[0]?.question}
                  sx={{
                    borderColor: "#cd1628",
                    transition: "all 200ms ease-in-out",
                    ":hover": {
                      borderColor: "#cd1628",
                      backgroundColor: "#cd1628",
                    },
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      color:
                        currentQuestion === questionList?.[0]?.question
                          ? "#ccc"
                          : "#cd1628",
                      transition: "all 200ms ease-in-out",
                      ":hover": {
                        color:
                          currentQuestion === questionList?.[0]?.question
                            ? "#ccc"
                            : "white",
                      },
                    }}
                  />
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    const currentIndex = questionList?.findIndex(
                      (q) => q.question === currentQuestion
                    );
                    const nextIndex = Math.min(
                      questionList?.length - 1,
                      currentIndex + 1
                    );
                    setCurrentQuestion(questionList[nextIndex].question);
                    sessionStorage.setItem(
                      CURRENT_QUESTION_KEY,
                      questionList[nextIndex].question
                    );
                  }}
                  disabled={
                    currentQuestion ===
                    questionList[questionList?.length - 1]?.question
                  }
                  sx={{
                    borderColor: "#cd1628",
                    transition: "all 200ms ease-in-out",
                    ":hover": {
                      borderColor: "#cd1628",
                      backgroundColor: "#cd1628",
                    },
                  }}
                >
                  <ArrowForwardIcon
                    sx={{
                      color:
                        currentQuestion ===
                        questionList[questionList?.length - 1]?.question
                          ? "#ccc"
                          : "#cd1628",
                      transition: "all 200ms ease-in-out",
                      ":hover": {
                        color:
                          currentQuestion ===
                          questionList[questionList?.length - 1]?.question
                            ? "#ccc"
                            : "white",
                      },
                    }}
                  />
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ExamDetailPage;
