import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { appointmentsFilePath } from '@lib/dataHelpers'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const filePath = appointmentsFilePath()

  fs.writeFileSync(filePath, JSON.stringify([]))
  res.status(201).json({
    message: 'Success!',
  })
}

export default handler
