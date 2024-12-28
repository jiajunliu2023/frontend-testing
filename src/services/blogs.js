import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

//get all blogs
const getAll = () => {

  //require authorization to get
  // const config = {
  //   headers: {
  //     Authorization: token, // Include the token in the request header
  //   },
  // };
  // const request = axios.get(baseUrl,config)
  //getting blogs corresponding to login users has to be doen with token

  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//add the blogs with authorization
const create = async newObject => {
  const config = {
    headers:{ Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
//update the blog
const update = async (id, updateObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, updateObject)
  return request.then(response => response.data)
}

const remove = async (id) => {
  const config = {
    headers:{ Authorization: token },
  }
  const response = axios.delete(`${ baseUrl }/${id}`, config)
  return response
}



export default { getAll, create, setToken, update, remove }