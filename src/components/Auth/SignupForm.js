import React from "react";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/AuthService";
import logo from "../../images/logo.png";

export default function SignupForm({ onToggle }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validate = () => {
    if (!formData.email) {
      toast.error("Vui lòng điền thông tin email.");
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Email không đúng định dạng.");
      return false;
    }

    if (!formData.fullName) {
      toast.error("Vui lòng điền thông tin họ và tên.");
      return false;
    }

    if (!formData.password) {
      toast.error("Vui lòng điền thông tin mật khẩu.");
      return false;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Mật khẩu có độ dài ít nhất 6 kí tự.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle signup logic here
    if (!validate()) {
      return;
    }
    try {
      setLoading(true);
      const response = await register(formData);
      if (response && response.message) {
        toast.success(response.message);
        navigate("/login");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card
          sx={{
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "none",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #2563eb, #9333ea)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                <img src={logo} alt="logo" className="w-30 h-20 mx-auto" />
              </Typography>
            }
            subheader={
              <Typography color="text.secondary">
                Đăng ký để bắt đầu hành trình của bạn
              </Typography>
            }
            sx={{ textAlign: "center", pb: 4 }}
          />

          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <div className="relative flex items-center justify-center">
              <Divider sx={{ width: "100%" }} />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  px: 2,
                  bgcolor: "white",
                  color: "text.secondary",
                  textTransform: "uppercase",
                }}
              >
                Hoặc đăng ký với
              </Typography>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <TextField
                  id="fullName"
                  label="Họ và tên"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </div>

              <div className="space-y-2">
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </div>

              <div className="space-y-2">
                <TextField
                  id="password"
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </div>

              <div className="space-y-2">
                <TextField
                  id="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  height: "44px",
                  background: "linear-gradient(to right, #2563eb, #9333ea)",
                  "&:hover": {
                    background: "linear-gradient(to right, #1d4ed8, #7e22ce)",
                  },
                }}
              >
                Tạo tài khoản
              </Button>
            </form>

            <div className="flex justify-center pt-4">
              <Typography variant="body2" color="text.secondary">
                Đã có tài khoản?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{
                    p: 0,
                    minWidth: "auto",
                    color: "#2563eb",
                    fontWeight: 500,
                  }}
                >
                  Đăng nhập ngay
                </Button>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
