/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";

const Countdown = ({ exam, onComplete, isTitle = false, examRoomId }) => {
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
      sessionStorage.setItem("time-left", JSON.stringify(timeLeft * 1000));

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
    <div className="flex items-center gap-2">
      {isTitle && (
        <span className="text-sm font-medium text-gray-400">
          Thời gian còn lại:
        </span>
      )}
      <span className="font-mono text-inherit tracking-widest">
          {formatTime(remainingTime)}
      </span>
    </div>
  );
};

export default Countdown;
