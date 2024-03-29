import { Availability, WorkingShift } from 'enums'

type Appointment = {
  oib: string
  text: string
  timestamp?: number
  date?: string
  slot: number
  name: string
}

type AllAppointments = { [key: number]: Appointment[] }

type Day = {
  timestamp: number
  dayIndex: number
  dateDisplay: string
  workingHours: WorkingShift
}

type AvailabilityType = {
  slot: number
  available: Availability
}

export type { Appointment, Day, AvailabilityType, AllAppointments }
