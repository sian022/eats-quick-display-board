import React, { useState } from 'react'
import useFetchOrders from '../../hooks/useFetchOrders'
import useSignalRConnection from '../../hooks/useSignalRConnection'
import styles from './styles.module.css'
import { getAllPreparingOrders, getAllServingOrders } from '../../services/orderService'
import OrderList from './OrderList'
import useTextToSpeech from '../../hooks/useTextToSpeech'
import { hubUrl } from '../../services/apiServices'

const DisplayBoard = () => {
  const [preparingOrders, setPreparingOrders] = useState([])
  const [servingOrders, setServingOrders] = useState([])

  const speak = useTextToSpeech()

  useFetchOrders(getAllPreparingOrders, setPreparingOrders)
  useFetchOrders(getAllServingOrders, setServingOrders)

  useSignalRConnection(`${hubUrl}/orders`, [
    { eventName: 'PreparingOrdersData', handler: setPreparingOrders },
    { eventName: 'ServingOrdersData', handler: setServingOrders }
  ])

  return (
    <div className={styles.displayBoard}>
      <OrderList title="Now Preparing" icon="fas fa-utensils" orders={preparingOrders} />
      <OrderList
        title="Now Serving"
        icon="fas fa-concierge-bell"
        orders={servingOrders}
        ordersOnClick={(orderId) => speak({ text: `Order ${orderId} is now serving!` })}
      />
    </div>
  )
}

export default DisplayBoard
