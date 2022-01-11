import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { extractAppointments, userAppointmentsFilePath } from '@lib/dataHelpers'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const filePath = userAppointmentsFilePath()

    fs.writeFileSync(filePath, JSON.stringify([]))
    res.status(201).json({
      message: 'Success!',
    })
  } else {
    const userAppointmentsPath = userAppointmentsFilePath()
    const userAppointments = extractAppointments(userAppointmentsPath)
    const data = [...userAppointments]
    res.status(200).json({
      data,
    })
  }
}

export default handler
