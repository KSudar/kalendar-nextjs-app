import { Appointment } from '@types'
import { FormEvent, useRef } from 'react'
import Modal from 'react-modal'
import styles from './CreateOrPreviewAppointmentModal.module.scss'
import { HoursSlot } from 'enums'

const CreateOrPreviewAppointmentModal = ({
  displayModal,
  onSubmit,
  onClose,
  oib,
  appointment,
  date,
}: {
  displayModal: boolean
  oib: string | undefined
  onSubmit?: ({ text, name, oib }: { text: string; name: string; oib: string }) => void
  onClose: () => void
  appointment?: Appointment | undefined
  date?: string
}) => {
  const nameRef = useRef<HTMLInputElement>(null)
  const oibRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = {
      text: textRef.current!.value || '',
      name: nameRef.current!.value || '',
      oib: !oib ? oibRef.current!.value || '' : oib,
    }
    onSubmit && onSubmit(params)
  }
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      isOpen={displayModal}
      onRequestClose={handleClose}
      className='modal'
      ariaHideApp={false}
      shouldCloseOnEsc={true}
    >
      <div className={styles.modalHeader}>
        {appointment ? '' : `Napravi rezervaciju za ${date}`}
      </div>
      <form onSubmit={handleSubmit} className={styles.modal}>
        {appointment && (
          <div>
            <label>Vrijeme:</label>
            <span className='preview-label'>
              {appointment.date} {HoursSlot[appointment.slot]}
            </span>
          </div>
        )}
        <div>
          <label>Ime i prezime:</label>
          {appointment ? (
            <span className='preview-label'>{appointment.name}</span>
          ) : (
            <input type='text' id='name' ref={nameRef} required />
          )}
        </div>
        <div>
          <label htmlFor='oib'>OIB:</label>
          {!!oib ? (
            <span className='preview-label'>{oib}</span>
          ) : (
            <>
              {appointment ? (
                <span className='preview-label'>{appointment.oib}</span>
              ) : (
                <input type='text' id='oib' ref={oibRef} required />
              )}
            </>
          )}
        </div>
        <div>
          <label htmlFor='description'>Razlog dolaska:</label>
          {appointment ? (
            <span className='preview-label'>{appointment.text}</span>
          ) : (
            <input type='text' id='description' ref={textRef} required />
          )}
        </div>
        <div className={styles.modalFooter}>
          <button type='button' onClick={handleClose} className='button button-secondary'>
            Natrag
          </button>
          {!appointment && (
            <button type='submit' className='button button-primary'>
              Potvrdi rezervaciju
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default CreateOrPreviewAppointmentModal
