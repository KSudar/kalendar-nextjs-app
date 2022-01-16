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
import { useEffect, useState } from 'react'

const Home = () => {
  const [appointments, setAppointments] = useState<AllAppointments>({})
  const router = useRouter()
  const oib: string = router.query.oib as string

  const handleGenerate = () => {
    generateAppointments()
    const appointmentsTemp = getAllAppointments()
    setAppointments({ ...appointmentsTemp })
  }

  const handleClear = () => {
    clearAppointments()
    const appointmentsTemp = getAllAppointments()
    setAppointments({ ...appointmentsTemp })
  }

  const handleClearUsersAppointments = () => {
    clearUserAppointments(oib)
    const appointmentsTemp = getAllAppointments()
    setAppointments({ ...appointmentsTemp })
  }

  useEffect(() => {
    const appointmentsTemp = getAllAppointments()
    setAppointments({ ...appointmentsTemp })
  }, [])

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
        <button onClick={handleClearUsersAppointments}>{`Clear This User's Appointments`}</button>
      </div>
      <div>
        <CalendarGrid allAppointments={appointments} oib={oib}></CalendarGrid>
      </div>
    </div>
  )
}

export default Home
