import { TAppointment } from '@types'
import { server } from '@config'
import dayjs from 'dayjs'
import {
  generateAppointment,
  generateRandomDay,
  generateSlotAndDate,
  generateTimestamp,
  getWorkingShift,
} from '@utils/helper'

const clearAppointments = async () => {
  await fetch(`${server}/api/appointments/clear`)
}

const generateAppointments = async () => {
  await fetch(`${server}/api/appointments/clear`)
  const appointments: TAppointment[] = []

  for (let i = 0; i < 15; i++) {
    // create appointment
    const dayOfAppointment = generateRandomDay()

    const generatedAppointment = generateAppointment(
      dayOfAppointment.format('ddd DD.MM.YY'),
      getWorkingShift(dayOfAppointment)
    )
    !!generatedAppointment && appointments.push(generatedAppointment)
    if (
      appointments.find(
        (appointment) =>
          appointment.timestamp === generatedAppointment.timestamp
      )
    ) {
    }
  }

  const response = await fetch(`${server}/api/appointments/generate`, {
    method: 'POST',
    body: JSON.stringify(appointments),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  // console.log('DATA ', data)
  return data
}

const getAllApointments = async () => {
  const response = await fetch(`${server}/api/appointments`)
  const { data } = await response.json()
  const appointments = data.map((appointment: TAppointment) => {
    const { slot, date, timestamp } = generateSlotAndDate(
      appointment.timestamp!
    )
    return { ...appointment, slot, date, timestamp }
  })
  return appointments
}

const createAppointment = async (appointment: TAppointment) => {
  const timestamp = generateTimestamp(appointment.date!, appointment.slot)
  const params = { timestamp, oib: appointment.oib, text: appointment.text }
  const response = await fetch(`${server}/api/appointments`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  return data
}

export {
  clearAppointments,
  createAppointment,
  generateAppointments,
  getAllApointments,
}
