import { Availability, WorkingShift } from 'enums'

type TAppointment = {
  oib: string
  text: string
  timestamp?: number
  date?: string
  slot: number
}

type TDay = {
  timestamp: number
  dayIndex: number
  dateDisplay: string
  dayDisplay: string
  workingHours: WorkingShift
}

type TAvailability = {
  slot: number
  available: Availability
}

export type { TAppointment, TDay, TAvailability }
