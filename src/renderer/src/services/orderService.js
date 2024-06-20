import { axiosInstance } from './apiServices'

export const getAllPreparingOrders = async () => {
  const response = await axiosInstance.get('orders/preparing')
  return response.data
}

export const getAllServingOrders = async () => {
  const response = await axiosInstance.get('orders')
  return response.data
}
