import CalendarDay from '@components/CalendarDay';
import { DaysOfTheWeek } from 'enums';

const CalendarGrid = () => {
	const currentDayIndex = new Date().getDay();
	const thisWeek = [];
	for (let i = 0; i < 7; i++) {
		thisWeek.push(
			DaysOfTheWeek[currentDayIndex + i + 1] ||
				DaysOfTheWeek[currentDayIndex - 6 + i]
		);
	}
	return (
		<table>
			<thead className='border-2'>
				<tr>
					<th className='border-2'>Hours</th>
					{thisWeek.map((day, index) => (
						<th key={index} className='border-2'>
							{day}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				<tr className='flex'>
					<td className='border-2'>
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
						<div>14:00</div>
						<div>14:30</div>
						<div>15:00</div>
						<div>15:30</div>
						<div>16:00</div>
						<div>16:30</div>
						<div>17:00</div>
						<div>17:30</div>
						<div>18:00</div>
						<div>18:30</div>
					</td>
					<td className='border-2 flex flex-col'>
						<CalendarDay takenAppointments={[]}></CalendarDay>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default CalendarGrid;
