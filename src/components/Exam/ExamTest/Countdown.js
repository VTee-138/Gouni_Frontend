import React, { useEffect, useState, useRef } from "react";
import { Typography, Stack } from "@mui/material";
import moment from "moment";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";

const Countdown = ({ exam, onComplete, isTitle = true, examRoomId }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const hasChecked = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!exam) return;

    const timeKey = `exam_time_${exam._id}_${examRoomId}`;
    let endTimeFromStorage = sessionStorage.getItem(timeKey);
    let endTime;

    if (endTimeFromStorage) {
      endTime = moment(parseInt(endTimeFromStorage));
    } else {
      const startTime = moment(exam.start);
      const durationInSeconds = exam.time * 60;
      endTime = moment(startTime).add(durationInSeconds, "seconds");
      sessionStorage.setItem(timeKey, endTime.valueOf());
    }

    const updateRemainingTime = () => {
      const now = moment();
      const diff = endTime.diff(now, "seconds");
      const timeLeft = diff > 0 ? diff : 0;

      setRemainingTime(timeLeft);
      // sessionStorage.setItem("time-left", JSON.stringify(timeLeft * 1000));

      // Nếu đã hết giờ và chưa gọi onComplete
      if (timeLeft === 0 && !hasChecked.current) {
        hasChecked.current = true;
        if (onCompleteRef.current) onCompleteRef.current();
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [exam]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (remainingTime === null) return null;

  return (
    <Stack
      // sx={{
      //   width: "100%",
      //   // backgroundColor: "white",
      //   padding: "15px",
      //   borderRadius: "10px",
      //   boxShadow: "0 1px 3px rgba(0, 0, 0, .05)",
      //   alignItems: "center",
      //   // justifyContent: "center",
      //   flexDirection: "row",
      // }}
      className="w-full p-4 flex flex-col lg:flex-row items-center"
    >
      {/* <AccessAlarmsIcon /> */}
      {isTitle && (
        <Typography className="text-xs md:text-[1rem] text-gray-300 mr-0 lg:mr-5 text-center">
          Thời gian còn lại
        </Typography>
      )}

      <strong className="text-xl font-mono">{formatTime(remainingTime)}</strong>
    </Stack>
  );
};

export default Countdown;
