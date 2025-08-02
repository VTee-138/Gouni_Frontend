import React, { useEffect, useState, useRef } from "react";

const CurrentTimer = ({ exam, current, examRoomId }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!exam || current === undefined) return;

    const key = `current_time_${exam._id}_${examRoomId}_${current}`;
    const savedStart = sessionStorage.getItem(key);

    let startTime;

    if (savedStart) {
      startTime = parseInt(savedStart, 10);
    } else {
      startTime = Date.now();
      sessionStorage.setItem(key, startTime.toString());
    }

    const updateTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);
    };

    updateTime();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateTime, 1000);

    return () => clearInterval(intervalRef.current);
  }, [exam, current]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <strong className="text-lg font-mono">{formatTime(elapsedSeconds)}</strong>
  );
};

export default CurrentTimer;
