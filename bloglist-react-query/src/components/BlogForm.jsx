import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  const handleBlogChange = ({ target }) => {
    setNewBlog({
      ...newBlog,
      [target.name]: target.value,
    });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            data-testid="title"
            type="text"
            id="title"
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            data-testid="author"
            type="text"
            id="author"
            value={newBlog.author}
            name="author"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            data-testid="url"
            type="text"
            id="url"
            value={newBlog.url}
            name="url"
            onChange={handleBlogChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
