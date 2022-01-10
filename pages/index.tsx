import CalendarGrid from '@components/CalendarGrid'
import { clearAppointments, generateAppointments, getAllApointments } from '@lib/apiService'
import { AllAppointments, Appointment, Day } from '@types'
import Head from 'next/head'
import { useState } from 'react'

const Home = ({ allAppointments }: { allAppointments: AllAppointments }) => {
  const [appointments, seAppointments] = useState<AllAppointments>(allAppointments)

  const handleClear = async () => {
    await clearAppointments()
    const appointmentsTemp = await getAllApointments()
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
        <button onClick={generateAppointments}>Generate New Appointments</button>
      </div>
      <div className='text-center'>
        <button onClick={handleClear}>Clear Appointments</button>
      </div>
      <CalendarGrid allAppointments={appointments}></CalendarGrid>
    </div>
  )
}

export const getStaticProps = async () => {
  await generateAppointments()
  const allAppointments = await getAllApointments()
  return { props: { allAppointments: allAppointments } }
}

export default Home
