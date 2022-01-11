import { AllAppointments, Appointment, AvailabilityType } from '@types'
import { server } from '@config'
import { Availability } from 'enums'
import {
  createDay,
  generateAppointment,
  generateEmptyDay,
  generateSlotAndDate,
  generatePreciseTimestamp,
} from '@utils/helper'
import dayjs from 'dayjs'

const clearAppointments = async () => {
  await fetch(`${server}/api/appointments/clear`)
}

const clearUserAppointments = async () => {
  await fetch(`${server}/api/appointments/usersAppointments`, { method: 'DELETE' })
}

const generateAppointments = async () => {
  await fetch(`${server}/api/appointments/clear`)

  const uAResponse = await fetch(`${server}/api/appointments/usersAppointments`)
  const { data: uAData } = await uAResponse.json()
  const usersAppointments = uAData.map((userAppointment: Appointment) => {
    const timestamp = dayjs(userAppointment.timestamp).startOf('day').valueOf()
    return { ...userAppointment, timestamp }
  })

  const appointments: Appointment[] = []
  const possibleAppointments: {
    [key: number]: (AvailabilityType | undefined)[]
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

  // Remove users created appointments from empty slots
  usersAppointments.forEach((userAppointment: Appointment) => {
    const dayTimestamp = userAppointment.timestamp!
    const availableSlots = possibleAppointments[dayTimestamp]
    let indexToDelete
    availableSlots.find((available, index) => {
      if (available?.slot === userAppointment.slot) {
        indexToDelete = index
      }
      return available?.slot === userAppointment.slot
    })
    if (indexToDelete !== undefined) {
      availableSlots.splice(indexToDelete, 1)
    }
    if (!availableSlots.length) {
      delete possibleAppointments[dayTimestamp]
    }
  })

  for (let i = 0; i < 15; i++) {
    const possibleDays = Object.keys(possibleAppointments)
    if (!possibleDays.length) {
      break
    }
    const randomDay = Math.floor(Math.random() * possibleDays.length)
    const dayTimestamp = Number(possibleDays[randomDay])
    const availableSlots = possibleAppointments[dayTimestamp]
    const randomSlot = availableSlots.splice(
      Math.floor(Math.random() * availableSlots.length),
      1
    )[0]?.slot
    appointments.push(generateAppointment(dayTimestamp, randomSlot!))
    if (!availableSlots.length) {
      delete possibleAppointments[dayTimestamp]
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
  return data
}

const getAllAppointments = async () => {
  const response = await fetch(`${server}/api/appointments`)
  const { data } = await response.json()
  const appointments: AllAppointments = {}
  data.forEach((appointment: Appointment) => {
    const { slot, date, timestamp } = generateSlotAndDate(appointment.timestamp!)
    const currentAppointmentsAtTimestamp = appointments[timestamp] || []
    appointments[timestamp] = [
      ...currentAppointmentsAtTimestamp,
      { ...appointment, slot, date, timestamp },
    ]
  })
  return appointments
}

const createAppointment = async (appointment: Appointment) => {
  const timestamp = generatePreciseTimestamp(appointment.date!, appointment.slot)

  const params = {
    timestamp,
    oib: appointment.oib,
    text: appointment.text,
    name: appointment.name,
    slot: appointment.slot,
  }

  const response = await fetch(`${server}/api/appointments`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'appl ication/json',
    },
  })
  const data = await response.json()

  return data
}

export {
  clearAppointments,
  createAppointment,
  generateAppointments,
  getAllAppointments,
  clearUserAppointments,
}
