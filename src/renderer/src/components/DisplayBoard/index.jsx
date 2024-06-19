import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { getAllOrders } from '../../services/orderService'
import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr'

function DisplayBoard() {
  const [connection, setConnection] = useState(null)
  const [orders, setOrders] = useState([])

  const fetchAllOrders = () => {
    getAllOrders().then((data) => {
      setOrders(data)
    })
  }

  useEffect(() => {
    fetchAllOrders()
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

          connection.on('sendOrdersData', (data) => {
            console.log('Refetching orders...')
            setOrders(data)
          })
        })
        .catch((e) => console.log('Connection failed: ', e))
    }
  }, [connection])

  console.log(orders, 'orders')

  return (
    <div className={styles.displayBoard}>
      <div className={styles.displayCategory}>
        <div
          style={{
            backgroundColor: '#E74B3C',
            color: 'white',
            width: '100%',
            textAlign: 'center',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h1>Now Preparing</h1>
        </div>

        <div className={styles.displayList}>
          {/* {Array.from({ length: 5 }).map((order, index) => (
            <div key={index + 1000} className={styles.order}>
              <h2>{index + 1000}</h2>
            </div>
          ))} */}

          {orders.map((order) => (
            <div key={order.id} className={styles.order}>
              <h2>{order.id}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.displayCategory}>
        <div
          style={{
            backgroundColor: '#E74B3C',
            color: 'white',
            width: '100%',
            textAlign: 'center',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h1>Prepared</h1>
        </div>
      </div>
    </div>
  )
}

export default DisplayBoard
