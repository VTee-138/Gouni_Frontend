/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";

const Countdown = ({ exam, onComplete, isTitle = false }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [completingTime, setCompletingTime] = useState(null);
  const hasChecked = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!exam) return;

    hasChecked.current = false;
    const startTime = moment(exam.start);
    const endTime = startTime.clone().add(exam.time, "minutes");

    const updateRemainingTime = () => {
      const now = moment();
      const diff = endTime.diff(now, "seconds");
      const timeLeft = Math.max(0, diff);

      setRemainingTime(timeLeft);
      sessionStorage.setItem("time-left", JSON.stringify(timeLeft * 1000));

      const elapsed = Math.max(0, now.diff(startTime, "seconds"));
      const fixedElapsed = Math.min(elapsed, exam.time * 60);

      setCompletingTime(fixedElapsed);
      sessionStorage.setItem(
        "exam_completing_time",
        JSON.stringify(fixedElapsed * 1000)
      );

      if (timeLeft === 0 && !hasChecked.current) {
        hasChecked.current = true;
        onCompleteRef.current?.();
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [exam?._id, exam?.start, exam?.time]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

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
