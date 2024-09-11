import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('calls the createBlog event handler with the right details when a new blog is created', async () => {
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText('title:');
  const authorInput = screen.getByLabelText('author:');
  const urlInput = screen.getByLabelText('url:');
  const createButton = screen.getByText('create');

  await userEvent.type(titleInput, 'Testing React forms');
  await userEvent.type(authorInput, 'Jane Doe');
  await userEvent.type(urlInput, 'http://example.com');
  await userEvent.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing React forms',
    author: 'Jane Doe',
    url: 'http://example.com',
  });
});
