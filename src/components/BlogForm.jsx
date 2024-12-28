import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] =useState('')
  const [url, setUrl] =useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    //after add the blog, empty the title, author, and url
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>blogs</h2>
      <form onSubmit={addBlog}>
        <div>
              title:
          <input type="text" placeholder="Title" value={title} name="title" onChange={event => setTitle(event.target.value)}/>
        </div>

        <div>
              author:
          <input type="text" placeholder="Author" value={author} name="author" onChange={event => setAuthor(event.target.value)}/>
        </div>

        <div>
              url:
          <input type="text" placeholder="URL" value={url} name="url" onChange={event => setUrl(event.target.value)}/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm