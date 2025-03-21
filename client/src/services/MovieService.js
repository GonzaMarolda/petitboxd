import axios from 'axios'
const baseUrl = '/api/movies'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
    return request.data
  }

const create = async newObject => {
    const response = await axios.post(baseUrl, newObject, {headers: { 'Content-Type': 'multipart/form-data' }})
    return response.data
}

const update = async (id, movie) => {
  const response = await axios.put(baseUrl + '/' + id, movie)
  return response.data
}

export default { getAll, create, update }