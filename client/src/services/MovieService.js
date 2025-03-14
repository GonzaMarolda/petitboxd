import axios from 'axios'
const baseUrl = '/api/movies'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
    return request.data
  }

const create = async newObject => {
    const request = await axios.post(baseUrl, newObject)
    console.log("Recieved data: " + request.data)
    return request.then(response => response.data)
}

const update = async (id, newObject) => {
    const request = await axios.put(baseUrl + "/" + id, newObject)
    console.log("Recieved data: " + request.data)
    return request.then(response => response.data)
}

const remove = async (id) => {
    const request = await axios.delete(baseUrl + "/" + id)
    console.log("Recieved data: " + request.data)
    return request.then(response => response.data)
}

export default { getAll, create, update, remove }