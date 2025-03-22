import axios from 'axios'
const baseUrl = '/api/movies'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log('Token set to ' + token)
}

const getAll = async () => {
    const request = await axios.get(baseUrl)
    console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
    return request.data
  }

const create = async newObject => {
  const config = {
    headers: {
      "Authorization": token,
      "Content-Type": "multipart/form-data"
    }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, movie) => {
  const config = {
    headers: {
      "Authorization": token,
      "Content-Type": "multipart/form-data"
    }
  }

  const response = await axios.put(baseUrl + '/' + id, movie, config)
  return response.data
}

export default { getAll, create, update, setToken }