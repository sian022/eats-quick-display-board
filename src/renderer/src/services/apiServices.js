import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://10.10.10.3:8081/api'
})

export const hubUrl = 'https://10.10.10.3:8081/'
