import axios from 'axios'
import { token } from './token'
const baseUrl = '/api/ratings'

const get = async (id) => {
  const request = await axios.get(baseUrl + "/" + id)
  console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
  return request.data
}

const update = async (id, review) => {
  const config = {
    headers: {
      "Authorization": token
    }
  }

  const response = await axios.put(baseUrl + '/' + id, review, config)
  return response.data
}

export default { update, get }