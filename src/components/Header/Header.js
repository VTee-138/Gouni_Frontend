import React, { useState, useEffect, useRef } from "react";
import logo from "../../images/logo.png";
import {
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  BookOpen,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkJwtExistsAndExpired,
  logout,
  getUserInfo,
} from "../../services/AuthService";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const auth = checkJwtExistsAndExpired();
      const user = getUserInfo();
      setIsAuthenticated(auth);
      setUserInfo(user);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    setIsUserMenuOpen(false);
  };

  const navigationItems = [
    { name: "Trang chủ", icon: "🏠", color: "text-blue-500", path: "/" },
    { name: "Khóa học", icon: "🔍", color: "text-blue-500", path: "/courses" },
    {
      name: "Phòng luyện thi",
      icon: "📚",
      color: "text-green-500",
      path: "/exam-rooms",
    },
    {
      name: "Tài liệu",
      icon: "📝",
      color: "text-purple-500",
      path: "/documents",
    },
    {
      name: "Bài viết",
      icon: "📰",
      color: "text-purple-500",
      path: "/blog",
    },
    {
      name: "Liên hệ GOUNI",
      icon: "📞",
      color: "text-teal-500",
      path: "/contact",
    },
  ];

  // User menu items
  const userMenuItems = [
    {
      name: "Thông tin cá nhân",
      icon: User,
      path: "/profile",
      color: "text-blue-500",
    },
    {
      name: "Khóa học của tôi",
      icon: BookOpen,
      path: "/my-courses",
      color: "text-green-500",
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[110]">
      <div className="max-w-7xl mx-auto">
        {/* Top bar with Logo, Search, and Auth buttons */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="GOUNI" className="h-8 sm:h-10 lg:h-12" />
            </Link>

            {/* Center - Search (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center px-6">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học, đề thi..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Right - Auth buttons or User menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button for mobile */}
              <button
                onClick={toggleSearch}
                className="md:hidden p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Auth buttons or User Menu */}
              {isAuthenticated && userInfo ? (
                // User Menu (when logged in)
                <div className="hidden sm:block relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {userInfo.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {userInfo.username || "User"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userInfo.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userInfo.email || "user@example.com"}
                        </p>
                      </div>

                      {userMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          {item.name}
                        </Link>
                      ))}

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Login/Register buttons (when not logged in)
                <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                  <Link to="/register">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded text-xs lg:text-sm font-medium transition-colors">
                      Đăng ký
                    </button>
                  </Link>

                  <Link to="/login">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded text-xs lg:text-sm font-medium transition-colors">
                      Đăng nhập
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-red-600 hover:text-red-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, đề thi..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden lg:block border-t border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-6 xl:space-x-8">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center py-3 text-sm text-gray-600 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  <span className={`mr-2 ${item.color}`}>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <div className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-6">
                  <img src={logo} alt="GOUNI" className="h-8" />
                  <button
                    onClick={closeMobileMenu}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* User info or Auth buttons for mobile */}
                {isAuthenticated && userInfo ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {userInfo.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {userInfo.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userInfo.email || "user@example.com"}
                        </p>
                      </div>
                    </div>

                    {userMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 py-2 px-3 text-sm text-gray-700 hover:bg-white hover:text-red-600 rounded transition-colors"
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        {item.name}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-2 px-3 text-sm text-red-600 hover:bg-red-50 rounded transition-colors w-full text-left mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mb-6 sm:hidden">
                    <Link to="/register">
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-3 rounded text-sm font-medium transition-colors w-full">
                        Đăng ký
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded text-sm font-medium transition-colors w-full">
                        Đăng nhập
                      </button>
                    </Link>
                  </div>
                )}

                {/* Navigation Items */}
                <nav className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Menu
                  </h3>
                  {navigationItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className="flex items-center py-3 px-3 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <span className={`mr-3 text-lg ${item.color}`}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </>
        )}

        {/* Red bottom border */}
        <div className="h-1 bg-red-600"></div>
      </div>
    </header>
  );
}
