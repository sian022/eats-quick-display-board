import { useCallback, useEffect } from 'react'

// Service to fetch orders
const useFetchOrders = (fetchOrdersFunc, setOrders) => {
  const fetchOrders = useCallback(async () => {
    const data = await fetchOrdersFunc()
    setOrders(data)
  }, [fetchOrdersFunc, setOrders])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])
}

export default useFetchOrders
