import { Appointment, AvailabilityType, Day } from '@types'
import { generateEmptyDay } from '@utils/helper'
import { Availability } from 'enums'
import React, { useEffect, useRef, useState } from 'react'
import CalendarBox from '@components/CalendarBox'
import { createAppointment } from '@lib/apiService'
import Notification from '@components/ui/Notification'
import CreateAppointmentModal from '@components/CreateAppointmentModal'
import PreviewAppointmentModal from '@components/PreviewAppointmentModal'

const CalendarDay = ({
  appointmentsToday,
  day,
  oib,
  userAppointmentsCount,
}: {
  appointmentsToday?: Appointment[]
  day: Day
  oib?: string
  userAppointmentsCount?: number
}) => {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>(
    generateEmptyDay(day.workingHours)
  )

  const maxAppointmentsReached = !!userAppointmentsCount && userAppointmentsCount >= 2

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>(appointmentsToday || [])
  const [displayModal, setDisplayModal] = useState(false)
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
        available: isYourAppointment ? Availability.YourAppointment : Availability.Unavailable,
        slot: appointment.slot,
      }
    })

    setAvailabilities([...appointmentsTemp])
  }, [day, todayAppointments, oib])

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
    setDisplayModal(false)
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
            availability.available === Availability.Available && !maxAppointmentsReached
              ? () => openCreateForm(availability.slot)
              : availability.available === Availability.YourAppointment
              ? () => openPreviewForm()
              : null
          }
        >
          {availability.available === Availability.YourAppointment ? (
            <span>Your Appointment</span>
          ) : (
            Availability[availability.available]
          )}
        </CalendarBox>
      ))}
      {displayModal && (
        <CreateAppointmentModal
          displayModal={displayModal}
          onSubmit={createAppointmentAtSlot}
          onClose={() => setDisplayModal(false)}
          oib={oib}
        />
      )}
      {displayPreviewModal && (
        <PreviewAppointmentModal
          displayModal={displayPreviewModal}
          onClose={() => setDisplayPreviewModal(false)}
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
