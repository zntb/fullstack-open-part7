import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlogLikes, removeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    await updateBlogLikes(blog.id, updatedBlog);
  };

  const handleRemove = () => {
    const confirmRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );
    if (confirmRemove) {
      removeBlog(blog.id);
    }
  };

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {detailsVisible ? "hide" : "view"}
        </button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <p data-testid="likes" className="blog-likes">
            {blog.likes} likes <button onClick={handleLike}>like</button>
          </p>
          <p className="blog-user">added by {blog.user.name}</p>
          {user.username === blog.user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlogLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
