import fs from 'fs'
import path from 'path'

const appointmentsFilePath = () => {
  return path.join(process.cwd(), 'data', 'appointments.json')
}

const extractAppointments = (filePath: string) => {
  const fileData: Buffer = fs.readFileSync(filePath)
  const data = JSON.parse(String(fileData))
  return data
}

export { appointmentsFilePath, extractAppointments }
