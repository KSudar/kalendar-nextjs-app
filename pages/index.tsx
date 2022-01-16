import CalendarGrid from '@components/CalendarGrid'
import {
  clearAppointments,
  clearUserAppointments,
  generateAppointments,
  getAllAppointments,
} from '@lib/apiService'
import { AllAppointments } from '@types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const Home = () => {
  const [appointments, seAppointments] = useState<AllAppointments>({})
  const oibRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleGenerate = () => {
    generateAppointments()
    const appointmentsTemp = getAllAppointments()
    seAppointments({ ...appointmentsTemp })
  }

  const handleClear = () => {
    clearAppointments()
    const appointmentsTemp = getAllAppointments()
    seAppointments({ ...appointmentsTemp })
  }

  const handleClearUsersAppointments = () => {
    clearUserAppointments()
    const appointmentsTemp = getAllAppointments()
    seAppointments({ ...appointmentsTemp })
  }

  useEffect(() => {
    handleGenerate()
  }, [])

  const goToUserCalendar = () => {
    if (oibRef.current?.value) {
      router.push(`/${oibRef.current.value}`)
    }
  }

  return (
    <div className='p-3'>
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
      <div>
        <CalendarGrid allAppointments={appointments}></CalendarGrid>
      </div>
    </div>
  )
}

export default Home
