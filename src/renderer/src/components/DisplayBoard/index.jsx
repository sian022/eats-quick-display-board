import React, { useState } from 'react'
import useFetchOrders from '../../hooks/useFetchOrders'
import useSignalRConnection from '../../hooks/useSignalRConnection'
import styles from './styles.module.css'
import { getAllPreparingOrders, getAllServingOrders } from '../../services/orderService'
import OrderList from './OrderList'
import useTextToSpeech from '../../hooks/useTextToSpeech'
import { hubUrl } from '../../services/apiServices'
import Bell from '../../assets/Bell.wav'

const DisplayBoard = () => {
  const [preparingOrders, setPreparingOrders] = useState([])
  const [servingOrders, setServingOrders] = useState([])

  const speak = useTextToSpeech()
  const bellSound = new Audio(Bell)

  useFetchOrders(getAllPreparingOrders, setPreparingOrders)
  useFetchOrders(getAllServingOrders, setServingOrders)

  useSignalRConnection(`${hubUrl}/orders`, [
    { eventName: 'PreparingOrdersData', handler: setPreparingOrders },
    {
      eventName: 'ServingOrdersData',
      handler: (data) => {
        // Filter out orders that are already served
        const unservedOrders = data.filter(
          (order) => !servingOrders.find((servingOrder) => servingOrder.id === order.id)
        )

        // Play the bell sound
        bellSound.play()

        // Speak the order numbers
        setTimeout(() => {
          unservedOrders.forEach((order) => speak({ text: `Order ${order.id} is now serving!` }))
        }, 700)

        setServingOrders(data)
      }
    }
  ])

  const handleServedOrderClick = (orderId) => {
    // Play the bell sound
    bellSound.play()

    // Delayed execution of speak function after 700ms
    setTimeout(() => {
      speak({ text: `Order ${orderId} is now serving!` })
    }, 700)
  }

  return (
    <div className={styles.displayBoard}>
      <OrderList title="Now Preparing" icon="fas fa-utensils" orders={preparingOrders} />
      <OrderList
        title="Now Serving"
        icon="fas fa-concierge-bell"
        orders={servingOrders}
        ordersOnClick={handleServedOrderClick}
      />
    </div>
  )
}

export default DisplayBoard
