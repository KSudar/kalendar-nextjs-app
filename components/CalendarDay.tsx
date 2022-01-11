import { Appointment, AvailabilityType, Day } from '@types'
import { generateEmptyDay } from '@utils/helper'
import { Availability } from 'enums'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import CalendarBox from '@components/CalendarBox'
import Modal from 'react-modal'
import { createAppointment } from '@lib/apiService'
import Notification from '@components/ui/Notification'

const CalendarDay = ({
  appointmentsToday,
  day,
}: {
  appointmentsToday?: Appointment[]
  day: Day
}) => {
  const [appointments, setAppointments] = useState<AvailabilityType[]>(
    generateEmptyDay(day.workingHours)
  )
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>(appointmentsToday || [])
  const [displayModal, setDisplayModal] = useState(false)
  const [notificationType, setNotificationType] = useState('')
  const [notificationText, setNotificationText] = useState('')
  const [appointmentSlot, setAppointmentSlot] = useState<number>()

  const nameRef = useRef<HTMLInputElement>(null)
  const oibRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const appointmentsTemp = generateEmptyDay(day.workingHours)
    todayAppointments?.forEach(
      (appointment) =>
        (appointmentsTemp[appointment.slot] = {
          available: Availability.Unavailable,
          slot: appointment.slot,
        })
    )
    setAppointments([...appointmentsTemp])
  }, [day, todayAppointments])

  useEffect(() => {
    setTodayAppointments(appointmentsToday || [])
  }, [appointmentsToday])

  const openCreateForm = (slot: number) => {
    setDisplayModal(true)
    setAppointmentSlot(slot)
  }

  const displayNotification = (type: string, text: string) => {
    setNotificationType(type)
    setNotificationText(text)
  }

  const createAppointmentAtSlot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    displayNotification('pending', 'Your appointments is being created!')

    //could use isOibValid method

    const appointment: Appointment = {
      slot: appointmentSlot!,
      text: textRef.current!.value || '',
      name: nameRef.current!.value || '',
      oib: oibRef.current!.value || '',
      date: day.dateDisplay,
    }

    const response = await createAppointment(appointment)
    if (response.errorMessage) {
      displayNotification('error', response.errorMessage)
    } else {
      displayNotification('success', response.message)
      const appointmentsTemp = [...todayAppointments]
      appointmentsTemp.push(appointment)
      setTodayAppointments(appointmentsTemp)
    }
    setDisplayModal(false)
  }

  return (
    <>
      {appointments.map((appointment) => (
        <CalendarBox
          key={appointment.slot}
          availability={appointment.available}
          onClick={
            appointment.available === Availability.Available
              ? () => openCreateForm(appointment.slot)
              : null
          }
        >
          {Availability[appointment.available]}
        </CalendarBox>
      ))}
      <Modal
        contentLabel='Ovo je modal'
        isOpen={displayModal}
        onRequestClose={() => setDisplayModal(false)}
        className='modal'
        ariaHideApp={false}
      >
        <form onSubmit={createAppointmentAtSlot}>
          <div>
            <label>Name:</label>
            <input type='text' id='name' ref={nameRef} required />
          </div>
          <div>
            <label htmlFor='oib'>Oib:</label>
            <input type='text' id='oib' ref={oibRef} required />
            <span>*Za provjera koliko je termina korisnik rezervirao je korišten OIB*</span>
          </div>
          <div>
            <label htmlFor='description'>Description:</label>
            <input type='text' id='description' ref={textRef} required />
          </div>
          <div className='flex justify-between'>
            <button type='button' onClick={() => setDisplayModal(false)}>
              Cancel
            </button>
            <button className='primary' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {!!notificationType && (
        <Notification
          message={notificationText}
          status={notificationType}
          onClick={() => {
            setNotificationText('')
            setNotificationType('')
          }}
        />
      )}
    </>
  )
}

export default CalendarDay
