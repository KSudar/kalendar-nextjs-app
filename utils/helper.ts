import { TAppointment } from '@types'
import dayjs, { Dayjs } from 'dayjs'
import { Availability, DaysOfTheWeek, HoursSlot, WorkingShift } from 'enums'
import customParseFormat from 'dayjs/plugin/customParseFormat'

export const generateRandomDay = (): Dayjs => {
  const dayOfTheWeek = Math.floor(Math.random() * 6 + 1) // doesn't include 0 which is Sunday
  const randomDay = dayjs().day(dayOfTheWeek).startOf('day')
  const isToday = randomDay.valueOf() === dayjs().startOf('day').valueOf()
  const dateObject = randomDay.add(isToday ? 7 : 0, 'day')
  if (getWorkingShift(dateObject) === WorkingShift.Closed) {
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

const generateAppointment = (timestamp: number, slot: number): TAppointment => {
  return {
    timestamp,
    oib: generateOib(),
    text: `Timestamp: ${timestamp}`,
    slot: slot!,
  }
}

const getWorkingShift = (day: Dayjs) => {
  // console.log('HMMM ', day.day(), day.date(), day.format('ddd'))
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

const createDay = (dayOffset: number) => {
  const day = dayjs().add(dayOffset, 'day').startOf('day')
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
  createDay,
}
