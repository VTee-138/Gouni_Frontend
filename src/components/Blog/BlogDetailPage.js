import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Box,
  Avatar,
  Divider,
  Skeleton,
  Button,
  IconButton,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Tag as TagIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { getBlogBySlug } from "../../services/BlogService";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";
import RelatedBlogs from "./RelatedBlogs";
import BlogMathRenderer from "./BlogMathRenderer";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogBySlug(slug);
      console.log(" fetchBlog ~ response:", response);

      if (response && response.data) {
        setBlog(response.data);
      } else {
        setError("Bài viết không tồn tại");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Lỗi khi tải bài viết");
      toast.error("Lỗi khi tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title?.text || blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết!");
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/blog?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline transition-colors">
              Trang chủ
            </Link>{" "}
            / <span className="text-gray-800 font-medium">Bài viết</span>
          </div>
          <div className="min-h-screen bg-gray-50 py-8">
            <Container maxWidth="md">
              <Card>
                <Skeleton variant="rectangular" height={300} />
                <CardContent className="p-8">
                  <Skeleton variant="text" height={40} width="80%" />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="60%"
                    className="mt-4"
                  />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="40%"
                    className="mt-2"
                  />
                  <Divider className="my-6" />
                  {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      height={20}
                      className="mt-2"
                    />
                  ))}
                </CardContent>
              </Card>
            </Container>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline transition-colors">
              Trang chủ
            </Link>{" "}
            / <span className="text-gray-800 font-medium">Bài viết</span>
          </div>
          <div className="min-h-screen bg-gray-50 py-8">
            <Container maxWidth="md">
              <Card>
                <CardContent className="text-center py-16">
                  <Typography variant="h5" color="error" className="mb-4">
                    {error || "Bài viết không tồn tại"}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/blog")}
                    startIcon={<ArrowBackIcon />}
                  >
                    Quay lại danh sách bài viết
                  </Button>
                </CardContent>
              </Card>
            </Container>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:underline transition-colors">
              Trang chủ
            </Link>{" "}
            /{" "}
            <Link to="/blog" className="hover:underline transition-colors">
              Bài viết
            </Link>{" "}
            /{" "}
            <span className="text-gray-800 font-medium">
              {blog?.title?.text}
            </span>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50">
          <Container>
            {" "}
            {/* Main Content */}
            <Card className="shadow-lg">
              {/* Featured Image */}
              {blog.imgUrl && (
                <CardMedia
                  component="img"
                  height="100"
                  image={blog.imgUrl}
                  alt={blog.title?.text || blog.title}
                  className="object-cover"
                />
              )}

              <CardContent className="p-8">
                {/* Category */}
                <div className="mb-4">
                  <Chip
                    label={blog.category}
                    color="primary"
                    variant="outlined"
                    onClick={() => handleCategoryClick(blog.category)}
                    className="cursor-pointer hover:bg-blue-50"
                    icon={<CategoryIcon />}
                  />
                </div>

                {/* Title */}
                <Typography
                  variant="h3"
                  component="h1"
                  className="font-bold text-gray-800 mb-4 leading-tight"
                >
                  {blog.title?.text || blog.title}
                </Typography>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <Avatar src={blog.author?.avatar} className="w-8 h-8 mr-2">
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body2">
                      {blog.author?.fullName || "Admin"}
                    </Typography>
                  </div>

                  <div className="flex items-center">
                    <ScheduleIcon className="w-5 h-5 mr-1" />
                    <Typography variant="body2">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </Typography>
                  </div>

                  <div className="flex items-center">
                    <VisibilityIcon className="w-5 h-5 mr-1" />
                    <Typography variant="body2">
                      {blog.views || 0} lượt xem
                    </Typography>
                  </div>

                  <IconButton
                    onClick={handleShare}
                    size="small"
                    className="ml-auto"
                    title="Chia sẻ"
                  >
                    <ShareIcon />
                  </IconButton>
                </div>

                <Divider className="mb-6" />

                {/* Excerpt */}
                {blog.excerpt && (
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    className="italic mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                  >
                    {blog.excerpt}
                  </Typography>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <BlogMathRenderer content={blog.content} />
                </div>

                <Divider className="mb-6" />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mb-6">
                    <Typography variant="h6" className="mb-3 flex items-center">
                      <TagIcon className="mr-2" />
                      Thẻ bài viết
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          variant="outlined"
                          onClick={() => handleTagClick(tag)}
                          className="cursor-pointer hover:bg-gray-50"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/blog")}
                    startIcon={<ArrowBackIcon />}
                  >
                    Xem thêm bài viết
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleShare}
                    startIcon={<ShareIcon />}
                    color="primary"
                  >
                    Chia sẻ
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Related Blogs */}
            <RelatedBlogs currentBlog={blog} maxItems={3} />
          </Container>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
