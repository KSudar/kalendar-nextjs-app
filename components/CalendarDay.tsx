import { TAppointment, TAvailability, TDay } from '@types'
import { generateEmptyDay, generateTimestamp } from '@utils/helper'
import { Availability, HoursSlot, WorkingShift } from 'enums'
import { useEffect, useState } from 'react'
import CalendarBox from '@components/CalendarBox'
import dayjs from 'dayjs'

const CalendarDay = ({
  appointmentsToday,
  day,
}: {
  appointmentsToday?: TAppointment[]
  day: TDay
}) => {
  const [appointments, setAppointments] = useState<TAvailability[]>(
    generateEmptyDay(day.workingHours)
  )

  useEffect(() => {
    const apointmentsTemp = [...appointments]
    appointmentsToday?.forEach(
      (appointment) =>
        (apointmentsTemp[appointment.slot] = {
          available: Availability.Unavailable,
          slot: appointment.slot,
        })
    )
    setAppointments([...apointmentsTemp])
  }, [day])

  return (
    <>
      {appointments.map((appointment) => (
        <CalendarBox
          key={appointment.slot}
          availability={appointment.available}
        >
          {Availability[appointment.available]}
        </CalendarBox>
      ))}
    </>
  )
}

export default CalendarDay
