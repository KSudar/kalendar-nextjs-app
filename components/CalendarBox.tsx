import { Availability } from 'enums'
import { useEffect, useState } from 'react'
import styles from './CalendarBox.module.scss'
const CalendarBox = ({
  children,
  availability,
  onClick,
}: {
  children: JSX.Element | string
  availability?: Availability
  onClick?: (() => void) | null
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>()

  useEffect(() => {
    if (availability === Availability.Rezerviraj) {
      setBackgroundColor(styles.available)
    } else if (availability === Availability.Zauzeto) {
      setBackgroundColor(styles.unavailable)
    } else if (availability === Availability.VasTermin) {
      setBackgroundColor(styles.reserved)
    } else if (availability === Availability.Pauza) {
      setBackgroundColor(styles.break)
    } else if (availability === Availability.Zatvoreno) {
      setBackgroundColor(styles.closed)
    } else {
      setBackgroundColor(styles.default)
    }
  }, [availability])

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className={`${styles.box} ${backgroundColor}`} onClick={handleClick}>
      {children}
    </div>
  )
}
export default CalendarBox
