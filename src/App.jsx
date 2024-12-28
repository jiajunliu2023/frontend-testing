import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm' //connect the loginform in the components file to app.jsx
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import { jwtDecode } from 'jwt-decode'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginUser, setloginUser] = useState(null)




  const [loginVisible, setLoginVisible] =useState(false)

  const SuccessNotification= ({ message }) => {
    if (message === null){
      return null
    }
    return (
      <div className='success'>
        {message}
      </div>
    )
  }
  const ErrorNotification= ({ message }) => {
    if (message === null){
      return null
    }
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
  // if the token expires, the memory of login user will be removed from browser
  // and the user will need to login again?
  useEffect (() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON ){
      const user = JSON.parse(loggedUserJSON)
      const decodedToken = jwtDecode(user.token)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp < currentTime) {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
      } else {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])
  // The empty array as the parameter of the effect ensures that the effect is executed only when the component is rendered for the first time.

  //get all blogs only when the user is logged
  // useEffect(() => {
  //   if (user){
  //     blogService.getAll().then(blogs =>
  //       setBlogs( blogs )
  //     )
  //   }
  // }, [user])
  //once the user is changed, the useEffect will be called

  useEffect(() => {

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )

  }, [])

  const updateLike = async (updateblog) => {
    try{
      const newBlog = {
        ...updateblog,
        likes: updateblog.likes + 1,
        user:  updateblog.user
      }
      const returnBlog = await blogService.update(updateblog.id, newBlog)
      setBlogs(blogs.map(blog => (blog.id !== updateblog.id ? blog :returnBlog)))
      setSuccessMessage(`You liked "${updateblog.title}"!`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      console.log('error', exception)
      setErrorMessage(`Failed to like "${updateblog.title}"`)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const deleteblog = async (blog) => {
    const confirmCheck = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (confirmCheck){
      try{
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }catch(error){
        console.log('error of deleting', error)
      }
    }
  }
  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username, password
      })

      const decodedToken = jwtDecode(user.token) // Decode the token
      const loggedinUser = { ...user, id: decodedToken.id } // Add the ID from the token
      console.log('login id', loggedinUser.id)
      //saving the user object, including token to the browser's local storage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(loggedinUser)
      setUsername('')
      setPassword('')
      setSuccessMessage(`${username}, logging in`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }catch(exception){
      console.error('Login error:', exception)
      setErrorMessage('Failed to log in. Please check your credentials.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.log(username, 'logging in')
  }

  const handleLogout = () => {
    //once the user log out, it will be removed from browser's local storage
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    // setBlogs([]) //empty the blog list
    setSuccessMessage('Logged out successfully')
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const loginForm = () => {

    const hidewhenvisible = { display:loginVisible? 'none':'' }  //hidden
    const showwhenvisible = { display:loginVisible? '':'none' } //displaying

    // login form

    return(
      <div>
        <div style={hidewhenvisible}>
          <button onClick={ () => {setLoginVisible(true)}}>Login</button>
        </div>

        <div style={showwhenvisible}>
          <LoginForm
            handleLogin={handleLogin}
            handleusernameChange={({ target }) => setUsername(target.value)}

            handlepasswordChange ={({ target }) => setPassword(target.value)}
            Username ={username}
            password={password}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>

        </div>
      </div>
    )
  }


  const addBlog = (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      // hide the form by calling blogFormRef.current.toggleVisibility() after a new blog has been created:
      blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewBlog('')
        })
      setSuccessMessage(`Blog "${blogObject.title}" added successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)
    }catch(exception){
      setErrorMessage('Failed to add blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }


  return (
    <div>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      {/* Conditional situation for login form or blog form */}
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {/* The blogFormRef variable acts as a reference to the component */}
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          {/* {blogForm()} */}
        </div>
      )}

      {/* Display blogs regardless of user login status */}
      <div>
        {/* sort the blogs by the number of likes  */}
        {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
          <Blog key={blog.id} blog={blog} updateLike={updateLike} deleteblog={deleteblog} loginUser={user}/>
        ))}
      </div>
    </div>
  )
}


export default App