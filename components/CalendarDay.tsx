import { Appointment, AvailabilityType, Day } from '@types'
import { generateEmptyDay, isOibValid } from '@utils/helper'
import { Availability, HoursSlot } from 'enums'
import React, { useEffect, useState } from 'react'
import CalendarBox from '@components/CalendarBox'
import { createAppointment } from '@lib/apiService'
import Notification from '@components/ui/Notification'
import CreateOrPreviewAppointmentModal from '@components/CreateOrPreviewAppointmentModal'

const CalendarDay = ({
  appointmentsToday,
  day,
  oib,
}: {
  appointmentsToday?: Appointment[]
  day: Day
  oib?: string
}) => {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>(
    generateEmptyDay(day.workingHours)
  )

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>(appointmentsToday || [])
  const [displayCreateModal, setDisplayCreateModal] = useState(false)
  const [displayPreviewModal, setDisplayPreviewModal] = useState(false)
  const [notificationType, setNotificationType] = useState('')
  const [notificationText, setNotificationText] = useState('')
  const [appointmentSlot, setAppointmentSlot] = useState<number>()
  const [appointmentToPreview, setAppointmentToPreview] = useState<Appointment>()
  useEffect(() => {
    const appointmentsTemp = generateEmptyDay(day.workingHours)
    todayAppointments?.forEach((appointment) => {
      const isYourAppointment = appointment.oib === oib
      appointmentsTemp[appointment.slot] = {
        available: isYourAppointment ? Availability.VasTermin : Availability.Zauzeto,
        slot: appointment.slot,
      }
    })

    setAvailabilities([...appointmentsTemp])
  }, [day, todayAppointments, oib])

  useEffect(() => {
    setTodayAppointments(appointmentsToday || [])
  }, [appointmentsToday])

  const openCreateForm = (slot: number) => {
    setDisplayCreateModal(true)
    setAppointmentSlot(slot)
  }

  const displayNotification = (type: string, text: string) => {
    setNotificationType(type)
    setNotificationText(text)
  }

  const createAppointmentAtSlot = ({
    text,
    name,
    oib,
  }: {
    text: string
    name: string
    oib: string
  }) => {
    displayNotification('pending', 'Your appointments is being created!')

    //could use isOibValid method

    const isOib = isOibValid(oib)

    if (!isOib) {
      displayNotification('error', 'Please enter valid OIB.')

      return
    }

    const appointment: Appointment = {
      slot: appointmentSlot!,
      text,
      name,
      oib,
      date: day.dateDisplay,
    }

    const response = createAppointment(appointment)
    if (response.errorMessage) {
      displayNotification('error', response.errorMessage)
    } else {
      displayNotification('success', response.message)
      const appointmentsTemp = [...todayAppointments]
      appointmentsTemp.push(appointment)
      setTodayAppointments(appointmentsTemp)
    }
    setDisplayCreateModal(false)
  }

  const openPreviewForm = () => {
    const appointmentToPreviewTemp = todayAppointments.find(
      (appointment) => appointment.oib === oib
    )
    setAppointmentToPreview(appointmentToPreviewTemp)
    setDisplayPreviewModal(true)
  }

  return (
    <>
      {availabilities.map((availability) => (
        <CalendarBox
          key={availability.slot}
          availability={availability.available}
          onClick={
            availability.available === Availability.Rezerviraj
              ? () => openCreateForm(availability.slot)
              : availability.available === Availability.VasTermin
              ? () => openPreviewForm()
              : null
          }
        >
          {availability.available === Availability.VasTermin ? (
            <span>Tvoja rezervacija</span>
          ) : (
            Availability[availability.available]
          )}
        </CalendarBox>
      ))}
      {displayCreateModal && (
        <CreateOrPreviewAppointmentModal
          displayModal={displayCreateModal}
          onSubmit={createAppointmentAtSlot}
          onClose={() => setDisplayCreateModal(false)}
          oib={oib}
          date={`${day.dateDisplay} ${HoursSlot[appointmentSlot!]} `}
        />
      )}
      {displayPreviewModal && (
        <CreateOrPreviewAppointmentModal
          displayModal={displayPreviewModal}
          onClose={() => setDisplayPreviewModal(false)}
          oib={oib}
          appointment={appointmentToPreview!}
        />
      )}
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
