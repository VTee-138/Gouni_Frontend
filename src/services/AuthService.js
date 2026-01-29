import { jwtDecode } from "jwt-decode";
import { post } from "../common/apiClient";

const PATH_AUTH = "/auth";
const login = async (body) => {
  return await post(PATH_AUTH + "/login", body, {
    withCredentials: true,
  });
};

const register = async (body) => {
  return await post(PATH_AUTH + "/signup", body, {
    withCredentials: true,
  });
};

const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const getUserInfo = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

const checkJwtExistsAndExpired = () => {
  const jwt = localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt"))
    : "";
  if (!jwt || !jwt.token) {
    localStorage.removeItem("jwt");
    return false; // Nếu không có token, coi như không hợp lệ
  }
  try {
    // Giải mã token và trích xuất trường exp
    const { exp } = jwtDecode(jwt.token);
    if (!exp) {
      localStorage.removeItem("jwt"); // Xóa tất cả thông tin trong localStorage
      return false; // Nếu không có trường exp, coi như không hợp lệ
    }

    // Lấy thời gian hiện tại tính bằng giây kể từ Unix Epoch
    const now = Date.now() / 1000;

    if (exp < now) {
      localStorage.removeItem("jwt"); // Xóa tất cả thông tin trong localStorage
      return false; // Token đã hết hạn
    }

    return true; // Token còn hiệu lực
  } catch (error) {
    localStorage.removeItem("jwt"); // Xóa tất cả thông tin trong localStorage nếu có lỗi khi giải mã token
    return false; // Nếu có lỗi khi giải mã token, coi như không hợp lệ
  }
};

const parseToken = () => {
  const jwt = localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt"))
    : "";
  if (!jwt || !jwt.token) {
    localStorage.removeItem("jwt");
    return false;
  }

  try {
    const decoded = jwtDecode(jwt.token);
    return decoded;
  } catch (error) {
    localStorage.removeItem("jwt");
    return false;
  }
};

export {
  login,
  checkJwtExistsAndExpired,
  parseToken,
  register,
  logout,
  getUserInfo,
};
