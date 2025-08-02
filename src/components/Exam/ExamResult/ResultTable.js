import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

const ResultTable = ({ resultDetail, resultAll }) => {
  if (!resultDetail || !resultAll) return null;
  const { userAnswers } = resultDetail;

  // Convert userAnswers to an array
  const answerEntries = Object.entries(resultAll).map(
    ([question, isCorrect]) => {
      const userAnswer = userAnswers[question];

      let answerText = "";
      if (typeof userAnswer === "object" && userAnswer !== null) {
        // Nếu là nhiều lựa chọn (object), ghép lại
        answerText = Object.entries(userAnswer)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      } else if (userAnswer) {
        answerText = userAnswer;
      } else {
        answerText = "Không trả lời";
      }

      return {
        question,
        answer: answerText,
        isCorrect,
      };
    }
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: 3,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 5,
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        fontWeight={"700"}
        sx={{
          padding: "20px",
        }}
      >
        Kết quả bài làm
      </Typography>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: "#cd1628",
                color: "common.white",
                fontWeight: "bold",
              }}
            >
              Câu hỏi
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#cd1628",
                color: "common.white",
                fontWeight: "bold",
              }}
            >
              Đáp án đã chọn
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#cd1628",
                color: "common.white",
                fontWeight: "bold",
              }}
            >
              Kết quả
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {answerEntries.map(({ question, answer, isCorrect }) => (
            <TableRow
              key={question}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <TableCell>{question}</TableCell>
              <TableCell>{answer}</TableCell>
              <TableCell sx={{ textAlign: "start" }}>
                {isCorrect ? (
                  <Chip
                    label="Đúng"
                    color="success"
                    sx={{
                      fontWeight: "bold",
                      padding: "0 12px",
                    }}
                  />
                ) : (
                  <Chip
                    label="Sai"
                    color="error"
                    sx={{
                      fontWeight: "bold",
                      padding: "0 12px",
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultTable;
