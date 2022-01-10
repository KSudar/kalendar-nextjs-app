import { TAppointment } from '@types'
import dayjs, { Dayjs } from 'dayjs'
import { Availability, HoursSlot, WorkingShift } from 'enums'
import customParseFormat from 'dayjs/plugin/customParseFormat'

export const generateRandomDay = (): Dayjs => {
  const dayOfTheWeek = Math.floor(Math.random() * 6 + 1) // doesn't include 0 which is Sunday
  const dateObject = dayjs().day(dayOfTheWeek).startOf('day')
  if (dayOfTheWeek == 6 && dateObject.date() % 2 !== 0) {
    return generateRandomDay()
  } else {
    return dateObject
  }
}

const generateTimestamp = (date: string, slot: HoursSlot) => {
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

const generateAppointment = (
  day: string,
  workingShift: WorkingShift
): TAppointment => {
  const possibleAppointments: number[] = []
  let timestamp
  let randomSlot
  for (let i = 0; i < 22; i++) {
    if (i !== 6 && i !== 16) {
      possibleAppointments.push(i)
    }
  }

  const generateRandomSlot = (max: number, min = 0): number => {
    const randomSlot = Math.floor(Math.random() * (max - min)) + min
    if (possibleAppointments.includes(randomSlot)) {
      return randomSlot
    } else {
      return generateRandomSlot(min, max)
    }
  }
  // console.log(possibleAppointments)
  if (workingShift === WorkingShift.Morning) {
    randomSlot = generateRandomSlot(HoursSlot['14:00'])
    timestamp = generateTimestamp(day, randomSlot)
  } else if (workingShift === WorkingShift.Afternoon) {
    randomSlot = generateRandomSlot(HoursSlot['19:00'], HoursSlot['13:00'])
    timestamp = generateTimestamp(day, randomSlot)
  }
  return {
    timestamp,
    oib: generateOib(),
    text: `Timestamp: ${timestamp}`,
    slot: randomSlot,
  }
}

const getWorkingShift = (day: Dayjs) => {
  console.log('HMMM ', day.day(), day.date(), day.format('ddd'))
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
    if ((i === 6 || i === 16) && availability === Availability.Available) {
      availability = Availability.Break
    }

    dayAppoitmentsArray.push({ slot: i, available: availability })
  }
  return dayAppoitmentsArray
}

export {
  generateEmptyDay,
  getWorkingShift,
  generateOib,
  generateAppointment,
  generateTimestamp,
  generateSlotAndDate,
}
