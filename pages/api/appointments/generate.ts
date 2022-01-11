import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { appointmentsFilePath } from '@lib/dataHelpers'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const appointments = req.body
    const filePath = appointmentsFilePath()
    fs.writeFileSync(filePath, JSON.stringify(appointments))
    res.status(201).json({
      message: 'Success!',
      appointments,
    })
  }
}

export default handler
