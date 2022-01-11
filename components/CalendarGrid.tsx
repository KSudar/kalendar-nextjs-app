import CalendarDay from '@components/CalendarDay'
import { DaysOfTheWeek, WorkingShift } from 'enums'
import dayjs, { Dayjs } from 'dayjs'
import WorkingHours from '@components/WorkingHours'
import { useEffect, useState } from 'react'
import { AllAppointments, Appointment, Day } from '@types'
import styles from './CalendarGrid.module.scss'
import { createDay, getWorkingShift } from '@utils/helper'
import customParseFormat from 'dayjs/plugin/customParseFormat'
// import styles from ''

const CalendarGrid = ({ allAppointments }: { allAppointments: AllAppointments }) => {
  const [appointments, seAppointments] = useState<AllAppointments>(allAppointments)
  const [thisWeek, setThisWeek] = useState<Day[]>([])

  useEffect(() => {
    seAppointments({ ...allAppointments })
  }, [allAppointments])

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
            <CalendarDay appointmentsToday={appointments[day.timestamp]} day={day} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CalendarGrid
