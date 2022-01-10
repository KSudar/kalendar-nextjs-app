import { TAppointment, TAvailability } from '@types'
import { server } from '@config'
import { Availability } from 'enums'
import {
  createDay,
  generateAppointment,
  generateEmptyDay,
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
  const possibleAppointments: {
    [key: string | number]: (TAvailability | undefined)[]
  } = {}
  for (let offset = 0; offset < 7; offset++) {
    const { timestamp, workingHours } = createDay(offset)
    const daySlots = generateEmptyDay(workingHours).filter((availability) => {
      return availability.available === Availability.Available
    })
    if (!!daySlots.length) {
      possibleAppointments[timestamp] = daySlots
    }
  }

  for (let i = 0; i < 15; i++) {
    const possibleDays = Object.keys(possibleAppointments)
    const randomDay = Math.floor(Math.random() * possibleDays.length)
    const dayTimestamp = Number(possibleDays[randomDay])
    const availableSlots = possibleAppointments[dayTimestamp]
    const randomSlot = availableSlots.splice(
      Math.floor(Math.random() * availableSlots.length),
      1
    )[0]
    if (!availableSlots.length) {
      delete possibleAppointments[dayTimestamp]
    }
    appointments.push(generateAppointment(dayTimestamp, randomSlot!.slot))
  }

  console.log(appointments)

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
