import PropTypes from 'prop-types'
const LoginForm = ({
  handleLogin,
  handleusernameChange,
  handlepasswordChange,
  Username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
            username
          <input type="text" value={Username} name="Username" onChange={handleusernameChange}/>
        </div>

        <div>
            password
          <input type="password" value={password} name="Password" onChange={handlepasswordChange}/>

        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )
}
LoginForm.prototype={
  handleLogin: PropTypes.func.isRequired,
  handleusernameChange: PropTypes.func.isRequired,
  handlepasswordChange: PropTypes.func.isRequired,
  Username: PropTypes.string.isRequired,
  password :PropTypes.string.isRequired
}
export default LoginForm



