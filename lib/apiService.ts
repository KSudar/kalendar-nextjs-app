import { AllAppointments, Appointment, AvailabilityType } from '@types'
import { Availability } from 'enums'
import {
  createDay,
  generateAppointment,
  generateEmptyDay,
  generateSlotAndDate,
  generatePreciseTimestamp,
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
  addToLocalStorage,
} from '@utils/helper'
import dayjs from 'dayjs'

const clearAppointments = () => {
  clearLocalStorage('generatedAppointments')
}

const getAllUserAppointments = () => {
  return getLocalStorage('userAppointments')
}

const clearUserAppointments = (oib?: string) => {
  if (oib) {
    const userAppointments = getAllUserAppointments().filter(
      (appointment: Appointment) => appointment.oib !== oib
    )
    setLocalStorage('userAppointments', userAppointments)
  } else {
    clearLocalStorage('userAppointments')
  }
}

const generateAppointments = () => {
  clearAppointments()
  const usersAppointments = getAllUserAppointments().map((userAppointment: Appointment) => {
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
      return availability.available === Availability.Rezerviraj
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

  setLocalStorage('generatedAppointments', appointments)
  return appointments
}

const getAllAppointments = () => {
  const generatedAppointments = getLocalStorage('generatedAppointments')
  const usersAppointments = getAllUserAppointments()
  const data = [...generatedAppointments, ...usersAppointments]
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

const createAppointment = (appointment: Appointment) => {
  const timestamp = generatePreciseTimestamp(appointment.date!, appointment.slot)
  const { oib, text, name, slot } = appointment
  const params = {
    timestamp,
    oib,
    text,
    name,
    slot,
  }

  let response = { errorMessage: '', message: '' }

  if (!oib || !name || !text) {
    response.errorMessage = 'Missing input'
    return response
  }

  const data: Appointment[] = getLocalStorage('userAppointments')

  const usersAppointments = data.filter((appointment) => appointment.oib === oib)

  if (usersAppointments.length >= 2) {
    response.errorMessage = 'Nije moguće napraviti više od dvije rezervacije tjedno'
    return response
  } else if (
    !!usersAppointments.find(
      (appointment) =>
        dayjs(appointment.timestamp).startOf('day').valueOf() ===
        dayjs(timestamp).startOf('day').valueOf()
    )
  ) {
    response.errorMessage = 'Nije dopušteno napraviti više od jedne rezervacije u danu'
    return response
  } else {
    addToLocalStorage('userAppointments', params)
    response.message = 'Rezervacija uspješno napravljena'
    return response
  }
}

export {
  clearAppointments,
  createAppointment,
  generateAppointments,
  getAllAppointments,
  clearUserAppointments,
}
