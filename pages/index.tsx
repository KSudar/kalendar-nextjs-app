import CalendarGrid from '@components/CalendarGrid'
import {
  clearAppointments,
  clearUserAppointments,
  generateAppointments,
  getAllAppointments,
} from '@lib/apiService'
import { AllAppointments } from '@types'
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
    <>
      <div className='header content-padding'>
        <h1>Kalendar Ordinacije</h1>
        <div className='settings-menu'>
          <button onClick={handleGenerate}>Generiraj termine</button>
          <button onClick={handleClear}>Obriši generirane termine</button>
          <button onClick={handleClearUsersAppointments}>Obriši korisničke termine</button>
        </div>
      </div>
      <div className='content-padding oib-section'>
        <div>
          <label>
            <strong>Unesi OIB</strong>
          </label>
          <input type='text' ref={oibRef} />
          <button onClick={goToUserCalendar} className='button button-primary'>
            Pogledaj rezervacije
          </button>
        </div>
      </div>
      <CalendarGrid allAppointments={appointments}></CalendarGrid>
    </>
  )
}

export default Home
