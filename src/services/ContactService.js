import apiClient from "../common/apiClient";

const ContactService = {
  // Gửi tin nhắn liên hệ
  createContact: async (contactData) => {
    try {
      const response = await apiClient.post("/contact", contactData);
      return response.data;
    } catch (error) {
      console.error("Error creating contact:", error);

      // Extract error message from response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi gửi tin nhắn";

      // Extract validation errors if available
      const validationErrors = error.response?.data?.errors || [];

      throw {
        message: errorMessage,
        errors: validationErrors,
        status: error.response?.status,
      };
    }
  },

  // Validate form data before sending
  validateContactData: (data) => {
    const errors = {};

    // Validate full name
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    } else if (data.fullName.trim().length > 100) {
      errors.fullName = "Họ và tên không được quá 100 ký tự";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Validate phone (optional)
    if (data.phone && data.phone.trim()) {
      const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
      if (!phoneRegex.test(data.phone.trim())) {
        errors.phone = "Số điện thoại không hợp lệ";
      }
    }

    // Validate subject
    if (!data.subject || data.subject.trim().length < 5) {
      errors.subject = "Tiêu đề phải có ít nhất 5 ký tự";
    } else if (data.subject.trim().length > 200) {
      errors.subject = "Tiêu đề không được quá 200 ký tự";
    }

    // Validate message
    if (!data.message || data.message.trim().length < 10) {
      errors.message = "Nội dung tin nhắn phải có ít nhất 10 ký tự";
    } else if (data.message.trim().length > 2000) {
      errors.message = "Nội dung tin nhắn không được quá 2000 ký tự";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Clean and prepare form data
  prepareContactData: (formData) => {
    return {
      fullName: formData.fullName?.trim() || "",
      email: formData.email?.trim().toLowerCase() || "",
      phone: formData.phone?.trim() || "",
      subject: formData.subject?.trim() || "",
      message: formData.message?.trim() || "",
    };
  },

  // Get default form data
  getDefaultFormData: () => {
    return {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    };
  },

  // Format error message for display
  formatErrorMessage: (error) => {
    if (error.status === 429) {
      return "Bạn đã gửi tin nhắn quá nhanh. Vui lòng chờ một chút trước khi gửi lại.";
    }

    if (error.status === 400 && error.errors && error.errors.length > 0) {
      return `Dữ liệu không hợp lệ: ${error.errors
        .map((err) => err.msg)
        .join(", ")}`;
    }

    return (
      error.message || "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau."
    );
  },

  // Generate random contact ID for tracking (optional)
  generateTrackingId: () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `CT${timestamp}${randomStr}`.toUpperCase();
  },

  // Check if form data has changed (for unsaved changes warning)
  hasFormChanged: (currentData, initialData) => {
    const current = ContactService.prepareContactData(currentData);
    const initial = ContactService.prepareContactData(initialData);

    return JSON.stringify(current) !== JSON.stringify(initial);
  },

  // Get common subject suggestions
  getSubjectSuggestions: () => {
    return [
      "Hỏi thông tin về khóa học",
      "Hỗ trợ kỹ thuật",
      "Góp ý về website",
      "Đề xuất cải tiến",
      "Báo lỗi hệ thống",
      "Tư vấn chương trình học",
      "Hỏi về chứng chỉ",
      "Liên hệ hợp tác",
      "Khác",
    ];
  },
};

export default ContactService;
