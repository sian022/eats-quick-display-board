import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://10.10.10.13:5001/api'
})

export const hubUrl = 'https://10.10.10.13:5001'
