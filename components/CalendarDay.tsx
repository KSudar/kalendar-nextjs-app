import { Appointment, AvailabilityType, Day } from '@types'
import { generateEmptyDay, generateTimestamp } from '@utils/helper'
import { Availability, HoursSlot, WorkingShift } from 'enums'
import { useEffect, useState } from 'react'
import CalendarBox from '@components/CalendarBox'
import dayjs from 'dayjs'

const CalendarDay = ({
  appointmentsToday,
  day,
}: {
  appointmentsToday?: Appointment[]
  day: Day
}) => {
  const [appointments, seAppointments] = useState<AvailabilityType[]>(
    generateEmptyDay(day.workingHours)
  )

  useEffect(() => {
    console.log('CALENDAR DAY ', appointmentsToday)
    const apointmentsTemp = [...appointments]
    appointmentsToday?.forEach(
      (appointment) =>
        (apointmentsTemp[appointment.slot] = {
          available: Availability.Unavailable,
          slot: appointment.slot,
        })
    )
    seAppointments([...apointmentsTemp])
  }, [day, appointmentsToday])

  const addAppointment = () => {}

  return (
    <>
      {appointments.map((appointment) => (
        <CalendarBox
          key={appointment.slot}
          availability={appointment.available}
          onClick={appointment.available === Availability.Available ? addAppointment : null}
        >
          {Availability[appointment.available]}
        </CalendarBox>
      ))}
    </>
  )
}

export default CalendarDay
