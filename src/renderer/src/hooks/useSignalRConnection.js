import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr'
import { useEffect, useState } from 'react'

// Service to handle SignalR connection
const useSignalRConnection = (url, events) => {
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)
  }, [url])

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connected!')
          events.forEach(({ eventName, handler }) => {
            connection.on(eventName, handler)
          })
        })
        .catch((e) => console.log('Connection failed: ', e))
    }

    return () => {
      if (connection) {
        connection.stop()
      }
    }
  }, [connection])

  return connection
}

export default useSignalRConnection
