import { TApointment } from '@types';

const CalendarDay = ({
	takenAppointments,
}: {
	takenAppointments?: TApointment[];
}) => {
	const availableApointments = [];
	return (
		<>
			<div>8:00</div>
			<div>8:30</div>
			<div>9:00</div>
			<div>9:30</div>
			<div>10:00</div>
			<div>10:30</div>
			<div>11:00</div>
			<div>11:30</div>
			<div>12:00</div>
			<div>12:30</div>
			<div>13:00</div>
			<div>13:30</div>
		</>
	);
};

export default CalendarDay;
