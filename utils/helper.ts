import { Appointment } from '@types'
import dayjs, { Dayjs } from 'dayjs'
import { Availability, DaysOfTheWeek, HoursSlot, WorkingShift } from 'enums'
import customParseFormat from 'dayjs/plugin/customParseFormat'

const generatePreciseTimestamp = (date: string, slot: HoursSlot) => {
  dayjs.extend(customParseFormat)
  return dayjs(`${date} ${HoursSlot[slot]}`, 'ddd DD.MM.YY. HH:mm').valueOf()
}

const generateSlotAndDate = (preciseTimestamp: number) => {
  const dateObject = dayjs(preciseTimestamp)
  const slot = HoursSlot[dateObject.format('HH:mm') as keyof typeof HoursSlot]
  const date = dateObject.format('ddd DD.MM.YY.')
  const startOfTheDayTimestamp = dateObject.startOf('day').valueOf()
  return { date, slot, timestamp: startOfTheDayTimestamp }
}

const generateAppointment = (dayTimestamp: number, slot: number): Appointment => {
  const dateDisplay = dayjs(dayTimestamp).format('ddd DD.MM.YY.')
  const preciseTimestamp = generatePreciseTimestamp(dateDisplay, slot)
  return {
    timestamp: preciseTimestamp,
    oib: generateOib(),
    text: `Timestamp: ${dayTimestamp}`,
    slot: slot!,
    name: 'Ime Prezime',
  }
}

const getWorkingShift = (day: Dayjs) => {
  if (day.date() % 2 === 0 && day.day() > 0) {
    return WorkingShift.Morning
  } else if (day.date() % 2 !== 0 && day.day() > 0 && day.day() < 6) {
    return WorkingShift.Afternoon
  } else {
    return WorkingShift.Closed
  }
}

const generateOib = () => {
  let oib = ''
  const oibDigits = new Array<number>(11)
  let t = 10
  for (let i = 0; i < 10; ++i) {
    oibDigits[i] = Math.floor(Math.random() * 10)
    oib += oibDigits[i].toString()
    t += oibDigits[i]
    t %= 10
    if (t === 0) t = 10
    t *= 2
    t %= 11
  }
  let controlNumber = 11 - t
  if (controlNumber === 10) controlNumber = 0

  oibDigits[10] = controlNumber
  oib += controlNumber.toString()
  return oib
}

const isOibValid = (oib: string): boolean => {
  if (!/^[0-9]{11}$/.test(oib)) return false

  let a = 10
  for (const digit of oib.substring(0, 10)) {
    a += parseInt(digit)
    a %= 10
    if (a === 0) a = 10
    a *= 2
    a %= 11
  }

  let controlDigit = 11 - a
  if (controlDigit === 10) controlDigit = 0

  return controlDigit === parseInt(oib.substr(10, 1)) //could use oib.split('').splice(10,1).join('')
}

const createDay = (dayOffset: number) => {
  const dayObject = dayjs().add(dayOffset, 'day').startOf('day')
  const isToday = dayObject.valueOf() === dayjs().startOf('day').valueOf()
  const day = dayObject.add(isToday ? 7 : 0, 'day')
  return {
    timestamp: day.valueOf(),
    dayIndex: day.day(),
    workingHours: getWorkingShift(day),
    dateDisplay: day.format('ddd DD.MM.YY.'),
    dayDisplay: DaysOfTheWeek[day.day()],
  }
}

const generateEmptyDay = (shift: WorkingShift) => {
  const dayAppoitmentsArray = []
  for (let i = 0; i < 22; i++) {
    let availability
    if (shift === WorkingShift.Closed) {
      availability = Availability.Closed
    } else if (shift === WorkingShift.Morning && i >= HoursSlot['14:00']) {
      availability = Availability.Closed
    } else if (shift === WorkingShift.Afternoon && i < HoursSlot['13:00']) {
      availability = Availability.Closed
    } else {
      availability = Availability.Available
    }
    if (
      (i === HoursSlot['11:00'] || i === HoursSlot['16:00']) &&
      availability !== Availability.Closed
    ) {
      availability = Availability.Break
    }

    dayAppoitmentsArray.push({ slot: i, available: availability })
  }
  return dayAppoitmentsArray
}

const setLocalStorage = (name: string, value: any) => {
  localStorage.setItem(name, JSON.stringify(value))
}

const clearLocalStorage = (name: string) => {
  localStorage.setItem(name, JSON.stringify([]))
}

const getLocalStorage = (name: string) => {
  return JSON.parse(localStorage.getItem(name) || '[]')
}

const addToLocalStorage = (name: string, value: any) => {
  const currentValue = getLocalStorage(name)
  setLocalStorage(name, [...currentValue, value])
}

export {
  generateEmptyDay,
  getWorkingShift,
  generateOib,
  generateAppointment,
  generatePreciseTimestamp,
  generateSlotAndDate,
  createDay,
  isOibValid,
  setLocalStorage,
  clearLocalStorage,
  getLocalStorage,
  addToLocalStorage,
}
