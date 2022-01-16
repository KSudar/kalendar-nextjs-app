import { Appointment } from '@types'
import { HoursSlot } from 'enums'
import { FormEvent, useRef } from 'react'
import Modal from 'react-modal'

const PreviewAppointmentModal = ({
  displayModal,
  onClose,
  appointment,
}: {
  displayModal: boolean
  appointment: Appointment
  onClose: () => void
}) => {
  const nameRef = useRef<HTMLInputElement>(null)
  const oibRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    onClose()
  }
  return (
    <Modal
      contentLabel='Preview appointment'
      isOpen={displayModal}
      onRequestClose={handleClose}
      className='modal'
      ariaHideApp={false}
      shouldCloseOnEsc={true}
    >
      <form>
        <div>
          <label>Date:</label>
          <label className='preview-label'>
            {appointment.date} {HoursSlot[appointment.slot]}
          </label>
        </div>
        <div>
          <label>Name:</label>
          <label className='preview-label'>{appointment.name}</label>
        </div>
        <div>
          <label htmlFor='oib'>Oib:</label>
          <label className='preview-label'>{appointment.oib}</label>
        </div>
        <div>
          <label htmlFor='description'>Description:</label>
          <label className='preview-label'>{appointment.text}</label>
        </div>
        <div className='flex justify-center'>
          <button type='button' onClick={handleClose}>
            Close
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default PreviewAppointmentModal
