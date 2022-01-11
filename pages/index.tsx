import CalendarGrid from '@components/CalendarGrid'
import {
  clearAppointments,
  clearUserAppointments,
  generateAppointments,
  getAllAppointments,
} from '@lib/apiService'
import { AllAppointments } from '@types'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const Home = () => {
  const [appointments, seAppointments] = useState<AllAppointments>({})

  const handleGenerate = async () => {
    await generateAppointments()
    const appointmentsTemp = await getAllAppointments()
    seAppointments({ ...appointmentsTemp })
  }

  const handleClear = async () => {
    await clearAppointments()
    const appointmentsTemp = await getAllAppointments()
    seAppointments({ ...appointmentsTemp })
  }

  const handleClearUsersAppointments = async () => {
    await clearUserAppointments()
    const appointmentsTemp = await getAllAppointments()
    seAppointments({ ...appointmentsTemp })
  }

  useEffect(() => {
    handleGenerate()
  }, [])

  return (
    <div>
      <Head>
        <title>Calendar app</title>
        <meta name='description' content='Weekly calendar app' />
      </Head>
      <h1>Kalendar App</h1>
      <div className='text-center'>
        <button onClick={handleGenerate}>Generate New Appointments</button>
      </div>
      <div className='text-center'>
        <button onClick={handleClear}>Clear Appointments</button>
      </div>
      <div className='text-center'>
        <button onClick={handleClearUsersAppointments}>{`Clear User's Appointments`}</button>
      </div>
      <CalendarGrid allAppointments={appointments}></CalendarGrid>
    </div>
  )
}

export default Home
