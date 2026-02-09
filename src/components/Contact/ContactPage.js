import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Telegram as TelegramIcon,
  Language as WebsiteIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

import Footer from "../Footer/Footer";
import ContactService from "../../services/ContactService";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Tiêu đề là bắt buộc";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Nội dung tin nhắn là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare and validate data
      const contactData = ContactService.prepareContactData(formData);
      const validation = ContactService.validateContactData(contactData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Send contact message
      const response = await ContactService.createContact(contactData);

      toast.success(
        response.message ||
          "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể."
      );

      // Reset form
      setFormData(ContactService.getDefaultFormData());
      setErrors({});
    } catch (error) {
      const errorMessage = ContactService.formatErrorMessage(error);
      toast.error(errorMessage);

      // Set validation errors if available
      if (error.errors && Array.isArray(error.errors)) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.msg;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <PhoneIcon className="text-red-500" />,
      title: "Điện thoại",
      content: "+84 24 3868 1616",
      description: "Thứ 2 - Thứ 6: 8:00 - 17:00",
    },
    {
      icon: <EmailIcon className="text-green-500" />,
      title: "Email",
      content: "86HSK.contact@gmail.com",
      description: "Phản hồi trong 24 giờ",
    },
    {
      icon: <LocationIcon className="text-red-500" />,
      title: "Địa chỉ",
      content: "Số 295 Thanh Nhàn, Hai Bà Trưng, Hà Nội",
      description: "Việt Nam",
    },
    {
      icon: <ScheduleIcon className="text-orange-500" />,
      title: "Giờ làm việc",
      content: "8:00 - 17:00",
      description: "Thứ 2 - Thứ 6",
    },
  ];

  const socialLinks = [
    {
      icon: <FacebookIcon />,
      name: "Facebook",
      url: "https://www.facebook.com/groups/tsahsathpt.86HSK",
      color: "from-red-600 to-red-700",
    },
    {
      icon: <YouTubeIcon />,
      name: "YouTube",
      url: "#",
      color: "from-red-600 to-red-700",
    },
    {
      icon: <TelegramIcon />,
      name: "Page",
      url: "https://www.facebook.com/86HSKedu",
      color: "from-red-400 to-red-500",
    },
    {
      icon: <WebsiteIcon />,
      name: "Tiktok",
      url: "#",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-red-600 via-purple-600 to-indigo-700 text-white py-20">
        <Container maxWidth="lg">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4 text-white">
              Liên hệ với chúng tôi
            </Typography>
            <Typography
              variant="h6"
              className="text-red-100 max-w-2xl mx-auto"
            >
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông
              tin để được tư vấn nhanh nhất!
            </Typography>
          </div>
        </Container>
      </Box>

      <Container maxWidth="lg" className="py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <span className="hover:underline cursor-pointer">Trang chủ</span>
          {" / "}
          <span className="text-gray-800 font-medium">Liên hệ</span>
        </div>

        <Grid container spacing={6}>
          {/* Contact Info Cards */}
          <Grid item xs={12}>
            <Typography
              variant="h4"
              className="font-bold text-center mb-8 text-gray-800"
            >
              Thông tin liên hệ
            </Typography>
            <Grid container spacing={4}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="text-center p-6">
                      <Box className="mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          {info.icon}
                        </div>
                        <Typography
                          variant="h6"
                          className="font-semibold text-gray-800 mb-2"
                        >
                          {info.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          className="font-medium text-red-600 mb-1"
                        >
                          {info.content}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {info.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider className="my-8" />
          </Grid>

          {/* Contact Form & Map */}
          <Grid item xs={12} md={8}>
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <Typography
                  variant="h4"
                  className="font-bold mb-6 text-gray-800 text-center"
                >
                  Gửi tin nhắn cho chúng tôi
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên *"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tiêu đề *"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SubjectIcon className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nội dung tin nhắn *"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        variant="outlined"
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              className="self-start mt-3"
                            >
                              <MessageIcon className="text-gray-400" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={<SendIcon />}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Contact Details */}
            <Card className="mb-6 shadow-lg">
              <CardContent className="p-6">
                <Typography
                  variant="h5"
                  className="font-bold mb-4 text-gray-800"
                >
                  Thông tin chi tiết
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <LocationIcon className="text-red-500 mt-1 mr-3" />
                    <div>
                      <Typography variant="body1" className="font-medium">
                        Địa chỉ
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Số 295 Thanh Nhàn, Hai Bà Trưng, Hà Nội, Việt Nam
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="text-red-500 mt-1 mr-3" />
                    <div>
                      <Typography variant="body1" className="font-medium">
                        Hotline
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        +84 24 3868 1616
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <EmailIcon className="text-green-500 mt-1 mr-3" />
                    <div>
                      <Typography variant="body1" className="font-medium">
                        Email
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        86HSK.contact@gmail.com
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ScheduleIcon className="text-orange-500 mt-1 mr-3" />
                    <div>
                      <Typography variant="body1" className="font-medium">
                        Giờ làm việc
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Thứ 2 - Thứ 6: 8:00 - 17:00
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography
                  variant="h5"
                  className="font-bold mb-4 text-gray-800"
                >
                  Kết nối với chúng tôi
                </Typography>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <Link to={social.url} target="_blank">
                      <Button
                        key={index}
                        variant="contained"
                        startIcon={social.icon}
                        className={`bg-gradient-to-r ${social.color} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                        fullWidth
                      >
                        {social.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box className="mt-12">
          <Typography
            variant="h4"
            className="font-bold text-center mb-8 text-gray-800"
          >
            Bản đồ
          </Typography>
          <Paper className="overflow-hidden rounded-2xl shadow-xl">
            {/* Map Header */}
            <div className="bg-gradient-to-r from-red-100 to-purple-100 p-6 text-center">
              <LocationIcon className="text-4xl text-red-500 mb-2" />
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-1"
              >
                Vị trí trên bản đồ
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Số 295 Thanh Nhàn, Hai Bà Trưng, Hà Nội, Việt Nam
              </Typography>
            </div>

            {/* Google Maps Iframe */}
            <div className="relative w-full h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.736575746416!2d105.84700787749573!3d21.00319403876082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac74c8f33df1%3A0xa0e2e2d91ac0e27a!2zMjk1IFAuIFRoYW5oIE5ow6BuLCBUaGFuaCBOaMOgbiwgSGFpIELDoCBUcsawbmcsIEjDoCBO4buZaSAxMDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1752243677812!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí 86HSK - 295 Thanh Nhàn, Hai Bà Trưng, Hà Nội"
              />
            </div>

            {/* Map Footer */}
            <div className="bg-gray-50 p-4 text-center">
              <Button
                variant="contained"
                className="bg-red-600 hover:bg-red-700"
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/place/295+P.+Thanh+Nh%C3%A0n,+Thanh+Nh%C3%A0n,+Hai+B%C3%A0+Tr%C6%B0ng,+H%C3%A0+N%E1%BB%99i+100000,+Vi%E1%BB%87t+Nam/@21.00319403876082,105.84700787749573,17z",
                    "_blank"
                  )
                }
                startIcon={<LocationIcon />}
              >
                Xem trên Google Maps
              </Button>
            </div>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default ContactPage;
