import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import RouterWrapper from "./RouterWrapper";
import HomePage from "./components/Home/Home";
import CoursesPage from "./components/Course/CoursesPage";
import DocumentsPage from "./components/Documents/DocumentsPage";
import ExamRoomsPage from "./components/ExamRoom/ExamRoomsPage";
import CourseDetailPage from "./components/Course/CourseDetailPage";
import DocumentDetailPage from "./components/Documents/DocumentDetailPage";
import ExamPage from "./components/Exam/ExamPage";
import ExamResultPage from "./components/Exam/ExamResult/ExamResultPage";
import ExamRankingPage from "./components/Exam/ExamRanking/ExamRankingPage";
import CheckoutPage from "./components/Course/CheckoutPage";
import ExamConfirmInfo from "./components/Exam/ExamConfirmInfo";
import ExamTestPage from "./components/Exam/ExamTest/ExamTestPage";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import ProfilePage from "./components/Profile/ProfilePage";
import MyCourses from "./components/MyCourses/MyCourses";
import { BlogsPage, BlogDetailPage } from "./components/Blog";
import ContactPage from "./components/Contact/ContactPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RouterWrapper />}>
      <Route element={<PrivateRoute />}>
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
        <Route path="/exam-rooms/:examRoomId" element={<ExamPage />} />
        <Route path="/exam/test/:id" element={<ExamTestPage />} />
        <Route path="/exam/result/:id" element={<ExamResultPage />} />
        <Route path="/exam/ranking/:id" element={<ExamRankingPage />} />
        <Route path="/thanh-toan/:courseId" element={<CheckoutPage />} />
        <Route path="/exam/confirm-info/:id" element={<ExamConfirmInfo />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/exam-rooms" element={<ExamRoomsPage />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Route>
  )
);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
