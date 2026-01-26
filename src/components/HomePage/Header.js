import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, BookOpen, FileText, GraduationCap, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { checkJwtExistsAndExpired, logout, getUserInfo } from "../../services/AuthService";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const navItems = [
    { name: "Trang chủ", path: "/", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Đề thi", path: "/exam", icon: <FileText className="w-5 h-5" /> },
    { name: "Blog", path: "/blog", icon: <GraduationCap className="w-5 h-5" /> },
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const auth = checkJwtExistsAndExpired();
      const user = getUserInfo();
      setIsAuthenticated(auth);
      setUserInfo(user);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <GraduationCap className="w-8 h-8" />
              <span>86HSK</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu / Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>{userInfo?.name || "Tài khoản"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Thông tin cá nhân</span>
                      </Link>
                      <Link
                        to="/my-courses"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Khóa học của tôi</span>
                      </Link>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Bắt đầu học
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-2 space-y-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link
                      to="/my-courses"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Khóa học của tôi</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors text-center cursor-pointer"
                    >
                      Bắt đầu học
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
