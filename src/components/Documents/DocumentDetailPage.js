import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Eye, User, Calendar } from "lucide-react";

import moment from "moment";
import { toast } from "react-toastify";
import { getDocumentById, getDocuments } from "../../services/DocumentService";
import Loading from "../Loading";
import Footer from "../Footer/Footer";
import { getUserInfo } from "../../services/AuthService";
import { FileText } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/documents" className="hover:text-red-600 transition-colors">
            Tài liệu
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{document?.title?.text}</span>
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
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                      download
                    >
                      <Download size={16} />
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
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                        download
                      >
                        <Download size={16} />
                        Tải đáp án
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Related documents */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Tài liệu nổi bật
                </h2>
                {documentsData.length > 0 ? (
                  <div className="space-y-3">
                    {documentsData.map((doc, idx) => (
                      <Link
                        key={idx}
                        to={`/documents/${doc._id}`}
                        className="flex items-start gap-3 p-4 rounded-xl hover:bg-red-50 transition-all border border-transparent hover:border-red-200 cursor-pointer group"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                        <span className="text-gray-700 group-hover:text-red-600 font-medium leading-relaxed transition-colors">
                          {doc.title?.text}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      Chưa có tài liệu liên quan
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Các tài liệu mới sẽ được cập nhật sớm
                    </p>
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
