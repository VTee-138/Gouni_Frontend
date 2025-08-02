// RouterWrapper.jsx
import React, { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";

const RouterWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    const examDetailRegex = /^\/exam\/detail\/[^/]+$/;
    if (!examDetailRegex.test(location.pathname)) {
      sessionStorage.removeItem("exam");
      sessionStorage.removeItem("exam-answers");
      sessionStorage.removeItem("current-question");
    }
  }, [location.pathname]);

  return <Outlet />;
};

export default RouterWrapper;
