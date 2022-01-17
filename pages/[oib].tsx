import CalendarGrid from '@components/CalendarGrid'
import {
  clearAppointments,
  clearUserAppointments,
  generateAppointments,
  getAllAppointments,
} from '@lib/apiService'
import { AllAppointments } from '@types'
import Link from 'next/link'
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
    <div>
      <div className='header content-padding'>
        <h1>Kalendar Ordinacije</h1>
        <div className='settings-menu'>
          <button onClick={handleGenerate}>Generiraj termine</button>
          <button onClick={handleClear}>Obriši generirane termine</button>
          <button onClick={handleClearUsersAppointments}>Obriši termine ovog korisnika</button>
        </div>
      </div>
      <div className='content-padding oib-section'>
        <strong>Pregled rezervacija za OIB: {oib}</strong>{' '}
        <Link href='/'>
          <span className='button button-primary'>Rezerviraj termin za drugu osobu</span>
        </Link>
      </div>
      <CalendarGrid allAppointments={appointments} oib={oib}></CalendarGrid>
    </div>
  )
}

export default Home
