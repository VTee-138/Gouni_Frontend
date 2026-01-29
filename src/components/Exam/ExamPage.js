import UserSidebar from "../UserSidebar";
import Exams from "./Exams";
import { useState } from "react";

const ExamPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen max-w-7xl mx-auto">
        <UserSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="ml-60 min-h-screen">
          <Exams />
        </div>
      </div>
    </>
  );
};

export default ExamPage;
