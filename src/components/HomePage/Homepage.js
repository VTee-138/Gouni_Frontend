import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "./Header";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import CoursesSection from "./CoursesSection";
import DocumentsSection from "./DocumentsSection";
import ExamRoomsSection from "./ExamRoomsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "../Footer/Footer";
import Loading from "../Loading";
import { getCourses } from "../../services/CourseService";
import { getDocuments } from "../../services/DocumentService";
import { getExamRooms } from "../../services/ExamRoomService";
import { getUserInfo } from "../../services/AuthService";

export default function Homepage() {
  const [loading, setLoading] = useState(false);
  const [coursesData, setCoursesData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [examRoomsData, setExamRoomsData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const userId = getUserInfo()?.id;

        const [coursesResponse, documentsResponse, examRoomsResponse] =
          await Promise.all([
            getCourses(1, 6, "", "", "", "", userId),
            getDocuments(1, 6, "", "", "", "", userId),
            getExamRooms(),
          ]);

        if (coursesResponse?.data) {
          setCoursesData(coursesResponse.data);
        }
        if (documentsResponse?.data) {
          setDocumentsData(documentsResponse.data);
        }
        if (examRoomsResponse?.data) {
          setExamRoomsData(examRoomsResponse.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message || "Có lỗi xảy ra";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Courses Section */}
        {coursesData.length > 0 && <CoursesSection courses={coursesData} />}

        {/* Documents Section */}
        {documentsData.length > 0 && (
          <DocumentsSection documents={documentsData} />
        )}

        {/* Exam Rooms Section */}
        {examRoomsData.length > 0 && (
          <ExamRoomsSection examRooms={examRoomsData} />
        )}

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
