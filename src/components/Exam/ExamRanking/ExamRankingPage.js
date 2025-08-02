import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Header from "../../Header/Header";
import { getResultAll, getResultById } from "../../../services/TestService";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import { getExamDetail } from "../../../services/ExamService";
import moment from "moment";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
// import { checkPremium } from "../../../services/UserService";

function ExamRankingPage() {
  const { id } = useParams();
  const isDesktop = useMediaQuery("(max-width:1024px)");
  const isDesktop992 = useMediaQuery("(max-width:992px)");
  const isDesktop768 = useMediaQuery("(max-width:768px)");
  const [loading, setLoading] = useState(false);
  const [resultDetail, setResultDetail] = useState();
  const [resultAll, setResultAll] = useState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examRoomId = searchParams.get("examRoomId");
  const [examData, setExamData] = useState(null);
  const [maxScore, setMaxScore] = useState(0);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const response = await getResultById(id, examRoomId);
      const response1 = await getResultAll(id, examRoomId);

      setResultDetail(response?.data);
      setResultAll(response1);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      navigate(`/courses/${error?.response?.data?.courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchExam = async () => {
    try {
      const responseExam = await getExamDetail(id, examRoomId);
      const examData = responseExam?.data;
      if (examData) {
        setExamData(examData);
        setMaxScore(responseExam?.maxScore);
      }
    } catch (error) {
      console.log("handleFetch ~ error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    handleFetchExam();
  }, [id, examRoomId]);

  useEffect(() => {
    handleFetch();
  }, [id, examRoomId]);

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
      <Header />
      <Stack sx={{ width: "100%", padding: 2 }} gap={"20px"}>
        <Typography variant="h5" component="h3" gutterBottom align="center">
          Kết Quả Của Bạn
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 6,
            border: "1px solid #ddd",
            overflow: "auto",
          }}
        >
          <Table sx={{ minWidth: 900 }} aria-label="personal result table">
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    color: "#ffffff !important",
                    fontSize: "16px",
                  },
                }}
                className="bg-blue-600"
              >
                <TableCell align="center">Thứ hạng</TableCell>
                <TableCell align="center">Tên</TableCell>
                <TableCell align="center">Điểm</TableCell>
                <TableCell align="center">Số câu đúng</TableCell>
                <TableCell align="center">Thời gian thi</TableCell>
                <TableCell align="center">Thời gian nộp bài</TableCell>
                <TableCell align="center">Xem đáp án chi tiết</TableCell>
                <TableCell align="center">Xem kết quả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {resultDetail?.ranking === 0 ? 1 : resultDetail?.ranking}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {resultDetail?.userId?.fullName || "Anonymous"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {resultDetail?.total_score || 0} / {maxScore}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {resultDetail?.numberOfCorrectAnswers || 0} /{" "}
                  {examData?.numberOfQuestions}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {moment(resultDetail?.updatedAt).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {resultDetail?.examCompledTime || 0} phút
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {resultDetail?.link_answer ? (
                    <Link
                      to={resultDetail?.link_answer}
                      target="_blank"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#3e90f7 ",
                        fontSize: "16px",
                      }}
                    >
                      <InsertLinkIcon></InsertLinkIcon>
                    </Link>
                  ) : (
                    "Không có"
                  )}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  <Link
                    to={`/exam/result/${id}?examRoomId=${examRoomId}`}
                    target="_blank"
                  >
                    <HistoryIcon sx={{ color: "#3e90f7" }}></HistoryIcon>
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h4" component="h2" gutterBottom align="center">
          Bảng Xếp Hạng
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 6,
            border: "1px solid #ddd",
            overflow: "auto",
            marginBottom: "20px",
          }}
        >
          <Table sx={{ minWidth: 900 }} aria-label="ranking table">
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    color: "#ffffff !important",
                    fontSize: "16px",
                  },
                }}
                className="bg-blue-600"
              >
                <TableCell align="center">Thứ hạng</TableCell>
                <TableCell align="center">Tên</TableCell>
                <TableCell align="center">Điểm</TableCell>
                <TableCell align="center">Số câu đúng</TableCell>
                <TableCell align="center">Thời gian thi</TableCell>
                <TableCell align="center">Thời gian nộp bài</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultAll?.data?.length > 0 &&
                resultAll.data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "#fafafa" },
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      {row?.userId?.fullName || "Anonymous"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      {row?.total_score || 0} / {maxScore}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      {row?.numberOfCorrectAnswers || 0} /{" "}
                      {examData?.numberOfQuestions}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      {moment(row?.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                      }}
                    >
                      {row?.examCompledTime || 0} phút
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}

export default ExamRankingPage;
