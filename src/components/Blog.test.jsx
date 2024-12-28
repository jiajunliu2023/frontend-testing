import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'


test('renders only Title and Author, but not URL or likes by default', () => {
  const blog ={
    title:'testing blog title',
    author:'Roger Doe',
    url: 'http://example.com',
    likes: 5
  }

  const updateLike = vi.fn()
  const deleteblog = vi.fn()
  const loginUser = null
  render(<Blog blog={blog} updateLike={updateLike} deleteblog={deleteblog} loginUser={loginUser}/>)

  // check whether the title and author are rendered
  // const title = screen.getByText('testing blog title')
  // expect(title).toBeDefined()
  // // expect(screen.getByText('testing blog title')).toBeInTheDocument()
  // expect(screen.getByText('Roger Doe')).toBeDefined()

  const title = screen.getByText((content, element) => content.includes('testing blog title') && element.textContent.includes('Roger Doe')
  )
  screen.debug(title)
  expect(title).toBeDefined()

  //check whether the url and likes are not rendered by default
  //queryByText: The method returns the element but it does not cause an exception if it is not found.
  expect(screen.queryByText('http://example.com')).not.toBeInTheDocument()
  expect(screen.queryByText('Likes: 5')).not.toBeInTheDocument()
})

test('url and likes are visible after clicking view', () => {
  const blog = {
    title:'testing blog title',
    author:'Roger Doe',
    url: 'http://example.com',
    likes: 5
  }
  const updateLike = vi.fn()
  const deleteblog = vi.fn()
  const loginUser = null
  render(<Blog blog={blog} updateLike={updateLike} deleteblog={deleteblog} loginUser={loginUser}/>)

  userEvent.click(screen.getByText('View'))

  expect(screen.queryByText('http://example.com')).toBeDefined()
  expect(screen.queryByText('like: 5')).toBeDefined()
})

test('like button calls event handler twice when clicked twice', async () => {
  const blog = {
    title: 'testing blog title',
    author: 'Roger Doe',
    url: 'http://example.com',
    likes: 5, // Ensure the property name matches the component
  }

  const updateLike = vi.fn()
  const deleteblog = vi.fn()
  const loginUser = null

  render(<Blog blog={blog} updateLike={updateLike} deleteblog={deleteblog} loginUser={loginUser} />)

  // Setup userEvent
  const user = userEvent.setup()

  // Click the "View" button to show details
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  // Then, the "Like" button should be visible
  // Find the "Like" button and click it twice
  const likeButton = screen.getByText('Like')

  await user.click(likeButton)
  await user.click(likeButton)

  // Assert the event handler is called twice
  // expect(updateLike.mock.calls).toHaveLength(2)
  expect(updateLike).toHaveBeenCalledTimes(2)
})






