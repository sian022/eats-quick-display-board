import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://10.10.10.3:8081/api'
})

export default axiosInstance
