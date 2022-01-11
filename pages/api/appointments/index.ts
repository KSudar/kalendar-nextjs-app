import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { Appointment } from '@types'
import {
  appointmentsFilePath,
  extractAppointments,
  userAppointmentsFilePath,
} from '@lib/dataHelpers'
import dayjs from 'dayjs'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { timestamp, slot, text, oib, name } = JSON.parse(req.body)
    const newAppointment = { timestamp, slot, text, oib, name }
    if (!oib || !name || !text) {
      res.status(400).json({ errorMessage: 'Missing input' })
      return
    }

    //store that in a database or a file
    const filePath = userAppointmentsFilePath()
    const data: Appointment[] = extractAppointments(filePath)

    const usersAppointments = data.filter((appointment) => appointment.oib === oib)

    if (usersAppointments.length >= 2) {
      res.status(403).json({ errorMessage: 'You already have 2 appointments this week' })
      return
    } else if (
      !!usersAppointments.find(
        (appointment) =>
          dayjs(appointment.timestamp).startOf('day').valueOf() ===
          dayjs(timestamp).startOf('day').valueOf()
      )
    ) {
      res.status(403).json({ errorMessage: 'You already have 1 appointment on this day' })
      return
    } else {
      data.push(newAppointment)
      fs.writeFileSync(filePath, JSON.stringify(data))
      res.status(201).json({
        message: 'Success!',
        appointment: newAppointment,
      })
    }
  } else {
    const generatedAppointmentsFilePath = appointmentsFilePath()
    const userAppointmentsPath = userAppointmentsFilePath()
    const generatedAppointments = extractAppointments(generatedAppointmentsFilePath)
    const userAppointments = extractAppointments(userAppointmentsPath)
    const data = [...generatedAppointments, ...userAppointments]
    res.status(200).json({
      data,
    })
  }
}

export default handler
