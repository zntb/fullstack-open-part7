import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BlogContainer = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
`;

const BlogLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: bold;
`;

const BlogTitle = styled.h3`
  margin: 0;
  font-size: 24px;
  color: #3539a0;
`;

const BlogAuthor = styled.h4`
  margin: 0;
  font-size: 18px;
  color: #3f3f3f;
`;

const Blog = ({ blog }) => {
  return (
    <BlogContainer>
      <BlogLink to={`/blogs/${blog.id}`}>
        <BlogTitle>{blog.title}</BlogTitle>
        <BlogAuthor>by {blog.author}</BlogAuthor>
      </BlogLink>
    </BlogContainer>
  );
};

export default Blog;
