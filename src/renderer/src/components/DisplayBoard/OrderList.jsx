import { useAutoAnimate } from '@formkit/auto-animate/react'
import styles from './styles.module.css'

const OrderList = ({ title, icon, orders, ordersOnClick }) => {
  const [parent] = useAutoAnimate()

  return (
    <div className={styles.displayCategory}>
      <div className={styles.displayCategoryHeader}>
        <p>{title}</p>
        <i className={icon}></i>
      </div>

      <div className={styles.displayList} ref={parent}>
        {orders.map((order) => (
          <div
            key={order.id}
            className={styles.order}
            onClick={ordersOnClick ? () => ordersOnClick(order.id) : undefined}
          >
            <p>{order.id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderList
