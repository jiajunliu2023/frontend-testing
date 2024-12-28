import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm calls addBlog with correct details on submission', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()
  render(
    <BlogForm
      createBlog={ createBlog }
    />
  )


  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'Testing Blog Title')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'http://example.com')
  await user.click(submitButton)



  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing Blog Title',
    author: 'John Doe',
    url: 'http://example.com',
  })
  // Verify addBlog is called once with the correct arguments
  // expect(addBlog.mock.calls).toHaveLength(1)
  // expect(addBlog.mock.calls[0][0].title).toBe('Testing Blog Title')
  // expect(addBlog).toHaveBeenCalledWith({
  //   title: 'Testing Blog Title',
  //   author: 'John Doe',
  //   url: 'http://example.com',
  // })
})
