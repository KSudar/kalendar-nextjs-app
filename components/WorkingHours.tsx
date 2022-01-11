import CalendarBox from '@components/CalendarBox'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const WorkingHours = () => {
  const [hours, setHours] = useState<string[]>([])
  const createHours = () => {
    const hoursTemp = []
    let startHour = dayjs().set('hours', 8).startOf('hour')
    for (let i = 0; i <= 630; i += 30) {
      hoursTemp.push(startHour.add(i, 'minute').format('HH:mm'))
    }
    setHours([...hoursTemp])
  }

  useEffect(() => {
    createHours()
  }, [])

  return (
    <>
      {hours.map((hour: string) => (
        <CalendarBox key={hour}>{hour}</CalendarBox>
      ))}
    </>
  )
}
export default WorkingHours
