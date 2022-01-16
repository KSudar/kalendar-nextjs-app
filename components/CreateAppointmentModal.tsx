import { Appointment } from '@types'
import { FormEvent, useRef } from 'react'
import Modal from 'react-modal'

const CreateAppointmentModal = ({
  displayModal,
  onSubmit,
  onClose,
  oib,
}: {
  displayModal: boolean
  oib: string | undefined
  onSubmit: ({ text, name, oib }: { text: string; name: string; oib: string }) => void
  onClose: () => void
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
    onSubmit(params)
  }
  const handleClose = () => {
    onClose()
  }
  return (
    <Modal
      contentLabel='Create appointment'
      isOpen={displayModal}
      onRequestClose={handleClose}
      className='modal'
      ariaHideApp={false}
      shouldCloseOnEsc={true}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type='text' id='name' ref={nameRef} required />
        </div>
        <div>
          <label htmlFor='oib'>Oib:</label>
          {!!oib ? (
            <label className='oib-label'>{oib}</label>
          ) : (
            <input type='text' id='oib' ref={oibRef} required />
          )}
          <span>*Za provjera koliko je termina korisnik rezervirao je korišten OIB*</span>
        </div>
        <div>
          <label htmlFor='description'>Description:</label>
          <input type='text' id='description' ref={textRef} required />
        </div>
        <div className='flex justify-between'>
          <button type='button' onClick={handleClose}>
            Cancel
          </button>
          <button className='primary' type='submit'>
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateAppointmentModal
