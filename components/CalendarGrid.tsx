import CalendarDay from '@components/CalendarDay'
import { DaysOfTheWeek, WorkingShift } from 'enums'
import dayjs, { Dayjs } from 'dayjs'
import WorkingHours from '@components/WorkingHours'
import { useEffect, useState } from 'react'
import { TAppointment, TDay } from '@types'
import styles from './CalendarGrid.module.scss'
import { getWorkingShift } from '@utils/helper'
import customParseFormat from 'dayjs/plugin/customParseFormat'
// import styles from ''

const CalendarGrid = ({
  allAppointments,
}: {
  allAppointments: TAppointment[]
}) => {
  const [thisWeek, setThisWeek] = useState<TDay[]>([])
  // console.log(allAppointments)
  const createDay = (dayOffset: number) => {
    const day = dayjs().add(dayOffset, 'day').startOf('day')
    return {
      timestamp: day.valueOf(),
      dayIndex: day.day(),
      workingHours: getWorkingShift(day),
      dateDisplay: day.format('ddd DD.MM.YY.'),
      dayDisplay: DaysOfTheWeek[day.day()],
    }
  }

  useEffect(() => {
    const thisWeekTemp: TDay[] = []
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
              appointmentsToday={allAppointments.filter((appointment) => {
                console.log(
                  dayjs(day.timestamp).toString(),
                  dayjs(appointment.timestamp).toString()
                )
                return appointment.timestamp === day.timestamp
              })}
              day={day}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CalendarGrid
