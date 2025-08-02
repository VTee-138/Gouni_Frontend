import React from "react";

import { useState, useEffect } from "react";
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
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/AuthService";
import Loading from "../Loading";
import logo from "../../images/logo.png";
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);

  // Xử lý sự kiện back button để về trang chủ
  useEffect(() => {
    const handlePopState = (event) => {
      // Ngăn chặn hành vi back mặc định và chuyển về trang chủ
      event.preventDefault();
      navigate("/", { replace: true });
    };

    // Thêm entry vào history để có thể bắt được sự kiện back
    window.history.pushState(null, null, window.location.pathname);

    // Lắng nghe sự kiện popstate (back button)
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const validate = () => {
    if (!email) {
      toast.error("Vui lòng điền thông tin email.");
      return false;
    }

    if (!password) {
      toast.error("Vui lòng điền thông tin mật khẩu.");
      return false;
    }

    return true;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      setLoading(true);
      const response = await login({ email, password });

      if (response && response.token) {
        localStorage.setItem("jwt", JSON.stringify({ token: response.token }));
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: response.username,
            email: response.email,
            id: response.id,
          })
        );
        navigate(from, { replace: true });
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card
          sx={{
            // width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "none",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CardHeader
            title={
              <Link to="/">
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
              </Link>
            }
            subheader={
              <Typography color="text.secondary">
                Đăng nhập vào tài khoản của bạn để tiếp tục
              </Typography>
            }
            sx={{ textAlign: "center", pb: 4 }}
          />

          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Đăng nhập
              </Button>
            </form>

            <div className="flex justify-center pt-4">
              <Typography variant="body2" color="text.secondary">
                Chưa có tài khoản?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/register")}
                  sx={{
                    p: 0,
                    minWidth: "auto",
                    color: "#2563eb",
                    fontWeight: 500,
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
