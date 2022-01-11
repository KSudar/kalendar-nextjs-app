import CalendarGrid from '@components/CalendarGrid'
import {
  clearAppointments,
  clearUserAppointments,
  generateAppointments,
  getAllAppointments,
} from '@lib/apiService'
import { AllAppointments } from '@types'
import Head from 'next/head'
import { useState } from 'react'

const Home = ({ allAppointments }: { allAppointments: AllAppointments }) => {
  const [appointments, seAppointments] = useState<AllAppointments>(allAppointments)

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

export const getStaticProps = async () => {
  await generateAppointments()
  const allAppointments = await getAllAppointments()
  return { props: { allAppointments: allAppointments } }
}

export default Home
