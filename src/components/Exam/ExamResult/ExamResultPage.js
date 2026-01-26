import React, { useEffect, useMemo, useState } from "react";
import { Typography, Box, Stack, useMediaQuery } from "@mui/material";
import {
  getResultById,
  getResultHistory,
} from "../../../services/TestService";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getExamDetail } from "../../../services/ExamService";
import MathRenderer from "../../../common/MathRenderer";
import TestTN from "..//ExamTest/TestTN";
import TestDS from "../ExamTest/TestDS";
import TestKT from "../ExamTest/TestKT";
import TestTLN from "../ExamTest/TestTLN";
import TestTLN_M from "../ExamTest/TestTLN_M";

function ExamResultPage() {
  const { id } = useParams();
  const isDesktop992 = useMediaQuery("(max-width:992px)");
  const isDesktop768 = useMediaQuery("(max-width:768px)");
  const [loading, setLoading] = useState(false);
  const [resultAll, setResultAll] = useState();
  const [resultDetail, setResultDetail] = useState();

  const [examData, setExamData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examRoomId = searchParams.get("examRoomId");
  // State for sorting

  const handleFetch = async () => {
    try {
      setLoading(true);
      const response = await getResultHistory(id, examRoomId);
      const response1 = await getResultById(id, examRoomId);
      const response2 = await getExamDetail(id, examRoomId);

      setResultAll(response?.data);
      setResultDetail(response1?.data);
      setExamData(response2?.data);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      navigate(`/courses/${error?.response?.data?.courseId}`);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack
      sx={{
        margin: isDesktop768
          ? "10px 20px 20px"
          : isDesktop992
          ? "20px 40px 40px"
          : "40px 80px 80px",
      }}
      direction={"column"}
      gap={"40px"}
    >

      {/* <ResultTable resultDetail={resultDetail} resultAll={resultAll} /> */}

      {questionList.length > 0 &&
        questionList.map((current, index) => (
          <Stack
            sx={{
              width: "100%",
              bgcolor: "white",
              height: "fit-content",
              padding: "20px",
              borderRadius: "10px",
              gap: "20px",
              transition: "width 300ms ease-in-out",
              boxShadow: "0px 2px 20px 20px rgb(0 0 0 / 5%);",
            }}
          >
            <Stack direction={"column"} gap={"10px"}>
              <Typography fontSize={20} fontWeight={600}>
                {current?.question}:
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
                {current.type === "TN" && (
                  <TestTN
                    answers={resultDetail?.userAnswers}
                    currentQuestion={current?.question}
                    handleSelectAnswer={() => {}}
                    current={current}
                    disable={true}
                  ></TestTN>
                )}
                {current.type === "DS" && (
                  <TestDS
                    answers={resultDetail?.userAnswers}
                    currentQuestion={current?.question}
                    handleSelectAnswer={() => {}}
                    current={current}
                    disable={true}
                  ></TestDS>
                )}
                {current.type === "KT" && (
                  <TestKT
                    key={resultDetail?.userAnswers}
                    answers={resultDetail?.userAnswers}
                    currentQuestion={current?.question}
                    handleSelectAnswer={() => {}}
                    onDragEnd={() => {}}
                    q={current}
                    disable={true}
                  ></TestKT>
                )}
                {current.type === "TLN" && (
                  <TestTLN
                    question={current?.question}
                    answers={resultDetail?.userAnswers}
                    handleChangeUserAnswersTLN={() => {}}
                    disable={true}
                  ></TestTLN>
                )}
                {current.type === "TLN_M" && (
                  <TestTLN_M
                    question={current?.question}
                    answers={resultDetail?.userAnswers}
                    q={current}
                    handleChangeUserAnswersTLN_M={() => {}}
                    disable={true}
                  ></TestTLN_M>
                )}
              </Box>
            </Stack>
            <Stack
              sx={{
                color: resultAll[current?.question.replace(":", "")]
                  ? "green"
                  : "red", // Màu xanh cho đúng, đỏ cho sai
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {resultAll[current?.question.replace(":", "")] ? "Đúng" : "Sai"}
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
}

export default ExamResultPage;
