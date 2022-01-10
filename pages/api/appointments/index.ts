import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { Appointment } from '@types'
import { appointmentsFilePath, extracAppointments } from '@lib/dataHelpers'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { timestamp, slot, text, oib, date } = req.body
    const newAppointment = { timestamp, slot, text, oib, date }

    //store that in a database or a file
    const filePath = appointmentsFilePath()
    const data: Appointment[] = extracAppointments(filePath)
    const usersAppointments = data.filter((appointment) => {
      return appointment.oib === oib
    })
    if (usersAppointments.length >= 2) {
      res.status(403).json({ message: 'You already have 2 appointments this week' })
    } else if (!!usersAppointments.find((appointment) => appointment.timestamp === timestamp)) {
      res.status(403).json({ message: 'You already have 1 appointment on this day' })
    } else {
      data.push(newAppointment)
      fs.writeFileSync(filePath, JSON.stringify(data))
      res.status(201).json({
        message: 'Success!',
        appointment: newAppointment,
      })
    }
  } else {
    const filePath = appointmentsFilePath()
    const data = extracAppointments(filePath)
    res.status(200).json({
      data,
    })
  }
}

export default handler
