import { TApointment, TDay } from '@types';

const CalendarDay = ({
	takenAppointments,
	day,
}: {
	takenAppointments?: TApointment[];
	day: TDay;
}) => {
	const availableApointments = [];
	return (
		<>
			<h2>CALENDAR DAY</h2>
		</>
	);
};

export default CalendarDay;
