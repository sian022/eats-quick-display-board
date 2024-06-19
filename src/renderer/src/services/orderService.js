import axios from 'axios'
import axiosInstance from './axiosInstance'

export const getAllOrders = async () => {
  const response = await axiosInstance.get('https://10.10.10.3:8081/api/orders')
  return response.data
}
