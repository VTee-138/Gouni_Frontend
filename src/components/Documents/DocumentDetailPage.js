import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Eye, User, Calendar } from "lucide-react";
import Header from "../Header/Header";
import moment from "moment";
import { toast } from "react-toastify";
import { getDocumentById, getDocuments } from "../../services/DocumentService";
import Loading from "../Loading";
import Footer from "../Footer/Footer";
import { getUserInfo } from "../../services/AuthService";

export default function DocumentDetailPage() {
  // Dữ liệu mẫu nếu chưa truyền prop
  const [document, setDocumentData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const { documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getDocuments(
          1,
          6,
          "",
          "numberOfVisitors",
          "desc",
          "true",
          getUserInfo()?.id
        );
        if (response && response?.data) {
          setDocumentsData(response?.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, []);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        const response = await getDocumentById(documentId);
        if (response && response?.data) {
          setDocumentData(response?.data);
        }
      } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message);
        navigate(`/courses/${error?.response?.data?.courseId}`);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, [documentId]);

  const getDownloadUrl = (url) => {
    if (!url) return;
    const match = url?.match(/\/d\/(.*?)\//);
    const fileId = match?.[1];
    return fileId
      ? `https://drive.google.com/uc?export=download&id=${fileId}`
      : null;
  };

  const handleDowload = async () => {
    try {
      //   await getNumberDownloadDocument(id);
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    }
  };

  if (loading) return <Loading />;
  return (
    <div>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>
            {" / "}
            <Link to="/documents" className="text-sm text-gray-500 mb-2">
              Tài liệu
            </Link>
            {" / "}
            <sapn className="text-gray-800 font-medium">
              {document?.title?.text}
            </sapn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-5 mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {document?.title?.text}
                </h1>
                <div className="flex flex-wrap gap-6 text-sm mb-3">
                  <span className="flex items-center gap-1 text-[#cd1628]">
                    <Eye size={16} /> Lượt đọc: {document?.numberOfVisitors}
                  </span>
                  <span className="flex items-center gap-1 text-[#cd1628]">
                    <Download size={16} /> Lượt tải:{" "}
                    {document?.numberOfDơwnload}
                  </span>
                  <span className="flex items-center gap-1 text-[#cd1628]">
                    <Calendar size={16} /> Ngày đăng:{" "}
                    {moment(document?.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="font-medium mb-2 text-gray-700">
                  {document?.description}
                </div>
                {/* PDF Viewer */}
                <div className="w-full h-[420px] bg-gray-100 rounded overflow-hidden mb-2 relative">
                  <iframe
                    src={document?.url?.replace("/view", "/preview")}
                    title={document?.fileName}
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                    allow="autoplay"
                  ></iframe>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-700">
                      {document?.title?.text}.pdf
                    </span>
                    <Link
                      to={getDownloadUrl(document?.url)}
                      onClick={handleDowload}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-1.5 rounded text-sm transition"
                      download
                    >
                      Tải xuống
                    </Link>
                  </div>
                  {document?.link_answer && document?.fileNameAnswer && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-700">
                        {document?.title?.text}.pdf
                      </span>
                      <Link
                        to={getDownloadUrl(document?.link_answer)}
                        onClick={handleDowload}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-1.5 rounded text-sm transition"
                        download
                      >
                        Tải xuống
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Related documents */}
            <div>
              <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                  <h2 className="font-bold text-gray-800 text-lg tracking-wide">
                    Tài liệu nổi bật
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent"></div>
                </div>
                {documentsData.length > 0 ? (
                  <div className="space-y-3">
                    {documentsData.map((doc, idx) => (
                      <div key={idx} className="group">
                        <Link
                          to={`/documents/${doc._id}`}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-red-200"
                        >
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                          <span className="text-gray-700 group-hover:text-red-600 font-medium text-sm leading-relaxed transition-colors">
                            {doc.title?.text}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-6 h-6 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Hiện tại chưa có tài liệu liên quan
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Các tài liệu sẽ được cập nhật sớm
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
