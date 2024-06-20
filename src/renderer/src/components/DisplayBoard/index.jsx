import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { getAllPreparingOrders, getAllServingOrders } from '../../services/orderService'
import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr'
import { useAutoAnimate } from '@formkit/auto-animate/react'

function DisplayBoard() {
  const [connection, setConnection] = useState(null)
  const [preparingOrders, setPreparingOrders] = useState([])
  const [servingOrders, setServingOrders] = useState([])
  const [isPreparingLoading, setIsPreparingLoading] = useState(true)
  const [isServingLoading, setIsServingLoading] = useState(true)

  const [parent] = useAutoAnimate()

  const fetchPreparingOrders = () => {
    getAllPreparingOrders().then((data) => {
      setIsPreparingLoading(false)
      setPreparingOrders(data)
    })
  }

  const fetchServingOrders = () => {
    getAllServingOrders().then((data) => {
      setIsServingLoading(false)
      setServingOrders(data)
    })
  }

  useEffect(() => {
    fetchPreparingOrders()
    fetchServingOrders()
  }, [])

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('https://10.10.10.3:8081/orders', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build()

    setConnection(connection)
  }, [])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log('Connected!')

          connection.on('PreparingOrdersData', (data) => {
            console.log('Refetching preparing orders...')
            setPreparingOrders(data)
          })

          connection.on('ServingOrdersData', (data) => {
            console.log('Refetching serving orders...')
            setServingOrders(data)
          })
        })
        .catch((e) => console.log('Connection failed: ', e))
    }
  }, [connection])

  return (
    <div className={styles.displayBoard}>
      <div className={styles.displayCategory}>
        <div className={styles.displayCategoryHeader}>
          <p>Now Preparing</p>
          <i className="fas fa-utensils"></i>
        </div>

        <div className={styles.displayList} ref={parent}>
          {preparingOrders.map((order) => (
            <div key={order.id} className={styles.order}>
              <p>{order.id}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.displayCategory}>
        <div className={styles.displayCategoryHeader}>
          <p>Now Serving</p>
          <i className="fas fa-concierge-bell"></i>
        </div>

        <div className={styles.displayList} ref={parent}>
          {servingOrders.map((order) => (
            <div key={order.id} className={styles.order}>
              <p>{order.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DisplayBoard
