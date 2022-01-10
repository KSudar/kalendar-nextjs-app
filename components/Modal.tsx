import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.scss'

const Modal = ({
  show,
  onClose,
  children,
  title,
}: {
  show: boolean
  onClose: () => void
  children: JSX.Element | string
  title: string
}) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleCloseClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClose()
  }

  const modalContent = show ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <a href='#' onClick={handleCloseClick}>
            x
          </a>
        </div>
        {title && <h1>{title}</h1>}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal') as Element)
  } else {
    return null
  }
}

export default Modal
