import { axiosInstance } from './apiServices'

export const getAllPreparingOrders = async () => {
  const response = await axiosInstance.get('https://10.10.10.3:8081/api/orders/preparing')
  return response.data
}

export const getAllServingOrders = async () => {
  const response = await axiosInstance.get('https://10.10.10.3:8081/api/orders')
  return response.data
}
