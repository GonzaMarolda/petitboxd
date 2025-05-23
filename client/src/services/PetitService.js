import axios from 'axios'
const baseUrl = '/api/petits'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
    return request.data
}

export default { getAll }