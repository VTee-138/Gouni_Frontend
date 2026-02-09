import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  actions = [],
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-200 p-6">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-500">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
              }}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
                ${action.primary 
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg" 
                  : action.danger
                    ? "bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                    : action.secondary 
                        ? "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;