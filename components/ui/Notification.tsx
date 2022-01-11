import { useEffect, useState } from 'react'
import styles from './Notification.module.scss'
import ReactDOM from 'react-dom'

function Notification({
  message,
  status,
  onClick,
}: {
  message: string
  status: string
  onClick?: () => void
}) {
  let statusClasses = ''
  const [displayNotification, setDisplayNotification] = useState(false)

  useEffect(() => {
    setDisplayNotification(true)
    if (status !== 'pending') {
      const timer = setTimeout(() => {
        setDisplayNotification(false)
        onClick && onClick()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [status, onClick])

  if (status === 'success') {
    statusClasses = styles.success
  }

  if (status === 'error') {
    statusClasses = styles.error
  }

  const cssClasses = `${styles.notification} ${statusClasses}`

  return ReactDOM.createPortal(
    <>
      {displayNotification && (
        <div
          onClick={() => {
            setDisplayNotification(false)
            onClick && onClick()
          }}
          className={cssClasses}
        >
          <h2 className='capitalize'>{status}</h2>
          <p>{message}</p>
        </div>
      )}
    </>,
    document.getElementById('notifications') as Element
  )
}

export default Notification
