import React, { useEffect, useRef } from "react";
import { Box, Button, Stack, useMediaQuery } from "@mui/material";

const ExamNumber = ({
  totalQuestions = 50,
  onSubmit,
  onSelect,
  hasStarted,
  answers = {},
  currentQuestion,
  questionList = [],
  loadingAPI,
}) => {
  const isDesktop992 = useMediaQuery("(max-width:992px)");

  const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const containerRef = useRef(null);
  const getButtonColor = (index) => {
    const questionKey = questionList?.[index]?.question;
    if (questionKey === currentQuestion) return "#cd1628";
    if (answers?.[questionKey]) return "#90caf9";
    else return "#e8ecee";
  };

  useEffect(() => {
    if (!containerRef.current || !questionList?.length) return;

    const index = questionList?.findIndex(
      (q) => q?.question === currentQuestion
    );
    if (index === -1) return;

    const rowIndex = Math.floor(index / 4);
    const buttonHeight = 40;
    const gap = 10;
    const scrollTop = rowIndex * (buttonHeight + gap);

    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }, [currentQuestion, questionList]);

  return (
    <Box
      sx={{
        p: "10px",
        borderRadius: "10px",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{
          mb: 2,
          backgroundColor: "#cd1628",
          transition: "all 200ms ease-in-out",
          ":hover": {
            backgroundColor: "#cd1628",
            opacity: 0.8,
          },
          fontSize: "16px",
        }}
        onClick={onSubmit}
        disabled={!hasStarted || loadingAPI}
        className="z-[100]"
      >
        Nộp bài
      </Button>

      <Stack
        ref={containerRef}
        sx={{
          maxHeight: isDesktop992 ? "200px" : "330px",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {questions.length > 0 &&
          questions.map((num, index) => {
            const questionKey = questionList?.[index]?.question;
            const isActive = questionKey === currentQuestion;

            return (
              <Button
                key={num}
                variant="contained"
                onClick={() => onSelect?.(index)}
                sx={{
                  minWidth: "100%",
                  height: "40px",
                  backgroundColor: getButtonColor(index),
                  color: isActive || answers[questionKey] ? "white" : "black",
                  fontWeight: "700",
                  "&:hover": {
                    backgroundColor: "#cd1628",
                    color: "white",
                  },
                }}
                disabled={!hasStarted}
              >
                {num}
              </Button>
            );
          })}
      </Stack>
    </Box>
  );
};

export default ExamNumber;
