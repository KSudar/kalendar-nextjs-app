import { basePath } from '@config'
import fs from 'fs'
import path from 'path'

const appointmentsFilePath = () => {
  return path.join(basePath, 'data', 'generatedAppointments.json')
}

const userAppointmentsFilePath = () => {
  return path.join(basePath, 'data', 'userAppointments.json')
}

const extractAppointments = (filePath: string) => {
  const fileData: Buffer = fs.readFileSync(filePath)
  const data = JSON.parse(String(fileData))
  return data
}

export { appointmentsFilePath, extractAppointments, userAppointmentsFilePath }
