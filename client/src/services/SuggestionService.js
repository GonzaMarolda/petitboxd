import axios from 'axios'
import { token } from './token'
const baseUrl = '/api/suggestions'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
    return request.data
  }

const create = async newObject => {
  const config = {
    headers: {
      "Authorization": token
    }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: {
      "Authorization": token
    }
  } 

  const response = await axios.delete(baseUrl + '/' + id, config)
  return response.data
}


export default { getAll, create, remove }