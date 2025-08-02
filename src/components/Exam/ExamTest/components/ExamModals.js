import React from "react";

const ExamModals = ({
  showFullscreenModal,
  shouldPromptFullscreen,
  setShouldPromptFullscreen,
  handleBackToFullscreen,
}) => {
  return (
    <>
      {/* Modal cảnh báo khi thoát fullscreen */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-xl font-bold text-red-600 mb-4 text-center">
              Bạn đã thoát khỏi chế độ toàn màn hình!
            </div>
            <div className="text-gray-700 mb-6 text-center">
              Vui lòng quay lại chế độ toàn màn hình để tiếp tục làm bài.
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleBackToFullscreen}
            >
              Quay lại toàn màn hình
            </button>
          </div>
        </div>
      )}

      {/* Modal prompt để bắt đầu fullscreen */}
      {shouldPromptFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bắt đầu bài kiểm tra
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn cần bật chế độ toàn màn hình để bắt đầu.
            </p>
            <button
              onClick={() => {
                const el = document.documentElement;
                if (el.requestFullscreen) el.requestFullscreen();
                else if (el.webkitRequestFullscreen)
                  el.webkitRequestFullscreen();
                else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
                else if (el.msRequestFullscreen) el.msRequestFullscreen();

                setShouldPromptFullscreen(false);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Bắt đầu toàn màn hình
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamModals;
