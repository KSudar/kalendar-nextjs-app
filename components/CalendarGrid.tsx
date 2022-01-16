import CalendarDay from '@components/CalendarDay'
import WorkingHours from '@components/WorkingHours'
import { useEffect, useState } from 'react'
import { AllAppointments, Appointment, Day } from '@types'
import styles from './CalendarGrid.module.scss'
import { createDay } from '@utils/helper'
import { getUserAppointmentLength } from '@lib/apiService'

const CalendarGrid = ({
  allAppointments,
  oib,
}: {
  allAppointments: AllAppointments
  oib?: string
}) => {
  const [appointments, setAppointments] = useState<AllAppointments>(allAppointments)
  const [thisWeek, setThisWeek] = useState<Day[]>([])
  const [userAppointmentsCount, setUserAppointmentsCount] = useState(0)

  useEffect(() => {
    setAppointments({ ...allAppointments })
    if (oib) {
      setUserAppointmentsCount(getUserAppointmentLength(oib))
    }
  }, [allAppointments, oib])

  useEffect(() => {
    const thisWeekTemp: Day[] = []
    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      thisWeekTemp.push(createDay(dayOffset))
    }
    setThisWeek([...thisWeekTemp])
  }, [])

  return (
    <div className='flex text-center justify-center'>
      <div>
        <div className={`${styles.header}`}>Hours:</div>
        <div>
          <WorkingHours />
        </div>
      </div>
      {thisWeek.map((day) => (
        <div key={day.dayIndex}>
          <div className={styles.header}>
            <div>{day.dateDisplay}</div>
          </div>
          <div>
            <CalendarDay
              appointmentsToday={appointments[day.timestamp]}
              day={day}
              oib={oib}
              userAppointmentsCount={userAppointmentsCount}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CalendarGrid
