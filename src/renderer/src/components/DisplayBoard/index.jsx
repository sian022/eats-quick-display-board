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
        setServingOrders((prevServingOrders) => {
          const unservedOrders = data.filter(
            (order) => !prevServingOrders.some((servingOrder) => servingOrder.id === order.id)
          )

          if (unservedOrders.length > 0) {
            bellSound.play()
            setTimeout(() => {
              unservedOrders.forEach((order) =>
                speak({ text: `Order ${transformOrderId(order.id)} is now serving!` })
              )
            }, 700)
          }

          console.log(unservedOrders, 'unserved')

          return data
        })
      }
    }
  ])

  const handleServedOrderClick = (orderId) => {
    // Play the bell sound
    bellSound.play()

    // Delayed execution of speak function after 700ms
    setTimeout(() => {
      speak({ text: `Order ${transformOrderId(orderId)} is now serving!` })
    }, 700)
  }

  const transformOrderId = (orderId) => {
    // Convert the order ID to a string and replace digits with their word equivalents
    if (orderId <= 100) return orderId

    const orderText = orderId
      .toString()
      .split('')
      .map((digit) => {
        switch (digit) {
          case '0':
            return 'o'
          case '1':
            return 'one'
          case '2':
            return 'two'
          case '3':
            return 'three'
          case '4':
            return 'four'
          case '5':
            return 'five'
          case '6':
            return 'six'
          case '7':
            return 'seven'
          case '8':
            return 'eight'
          case '9':
            return 'nine'
          default:
            return digit
        }
      })
      .join(' ')

    return orderText
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
