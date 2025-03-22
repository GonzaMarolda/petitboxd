import axios from 'axios'
const baseUrl = '/api/login'

const login = async (key) => {
    const request = await axios.post(baseUrl, {key})
    console.log("Recieved data: " + JSON.stringify(request.data, null, 2))
    return request.data
}

export default { login }