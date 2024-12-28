
import React, { useState } from 'react'

const Blog = ({ blog, updateLike, deleteblog, loginUser }) => {
  const [showDetails, setshowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggledetails = () => {
    setshowDetails(!showDetails)
  }




  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggledetails}>{showDetails ? 'Hide' : 'View'}</button>

      </div>
      {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={() => updateLike(blog)}>Like</button></p>
          <p>Added by: {blog.user?.name || 'Unknown'}</p>
          {/* {loginUser && blog.user && (
      // console.log("LoginUser ID:", loginUser.id, "Blog User ID:", blog.user.id)
)} */}
          {/* check whether the blog was added by the logged-in user */}
          {loginUser && blog.user && loginUser.id === blog.user.id && (
            <p><button onClick={() => deleteblog(blog)}>Remove</button></p>
          )}
        </div>
      )}
    </div>
  )}

export default Blog