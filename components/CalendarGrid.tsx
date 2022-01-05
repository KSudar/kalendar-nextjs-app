import CalendarDay from '@components/CalendarDay';
import { DaysOfTheWeek, WorkingShift } from 'enums';
import dayjs, { Dayjs } from 'dayjs';
import WorkingHours from '@components/WorkingHours';
import { useEffect, useState } from 'react';
import { TDay } from '@types';
require('dayjs/locale/hr');

const CalendarGrid = () => {
	const currentDayIndex = dayjs().day();
	const [thisWeek, setThisWeek] = useState<TDay[]>([]);

	const createDay = (dayIndex: number) => {
		return {
			dateDisplay: dayjs()
				.locale('hr')
				.add(dayIndex, 'day')
				.format('ddd D. MMM YY.'),
			dayOfWeek:
				DaysOfTheWeek[
					dayjs()
						.day(currentDayIndex + dayIndex)
						.day()
				],
		};
	};

	const getWorkingShift = (date: Dayjs) => {
		if (date.date() % 2 === 0 && date.day() < 6) {
			return WorkingShift.Morning;
		} else if (date.date() % 2 !== 0 && date.day() < 5) {
			return WorkingShift.Afternoon;
		} else {
			return WorkingShift.Closed;
		}
		console.log('DATE: ', date.date());
		console.log('DAY: ', date.day());
		console.log('NAME: ', date.format('dddd'));
	};

	useEffect(() => {
		const thisWeekTemp: TDay[] = [];
		for (let i = 1; i <= 7; i++) {
			const day = dayjs().locale('hr').add(i, 'day');
			thisWeekTemp.push({
				dayIndex: day.day(),
				dayDisplay: DaysOfTheWeek[day.day()],
				dateDisplay: day.format('ddd D. MMM YY.'),
				workingHours: getWorkingShift(day),
			});
		}
		setThisWeek([...thisWeekTemp]);
	}, []);

	console.log(dayjs('01-25-2022', 'MM-DD-YYYY').date());

	console.log(thisWeek);

	return (
		<div className='flex border-2'>
			<div className='border-2 col-span-1'>
				<div className='table-header-group'>Hours:</div>
				<div>
					<WorkingHours />
				</div>
			</div>
			{thisWeek.map((day) => (
				<div key={day.dayIndex} className='border-2 col-span-1'>
					<div className='mx-4'>
						<div>{day.dateDisplay}</div>
					</div>
					<div>
						<CalendarDay day={day} />
					</div>
				</div>
			))}
		</div>
	);
	// return (
	// 	<table>
	// 		<thead className='border-2'>
	// 			<tr>
	// 				<th className='border-2'>Hours</th>
	// 				{thisWeek.map((day, index) => (
	// 					<th key={index} className='border-2'>
	// 						{day}
	// 					</th>
	// 				))}
	// 			</tr>
	// 		</thead>
	// 		<tbody>
	// 			<tr className='flex'>
	// 				<td className='border-2'>
	// <div>8:00</div>
	// <div>8:30</div>
	// <div>9:00</div>
	// <div>9:30</div>
	// <div>10:00</div>
	// <div>10:30</div>
	// <div>11:00</div>
	// <div>11:30</div>
	// <div>12:00</div>
	// <div>12:30</div>
	// <div>13:00</div>
	// <div>13:30</div>
	// <div>14:00</div>
	// <div>14:30</div>
	// <div>15:00</div>
	// <div>15:30</div>
	// <div>16:00</div>
	// <div>16:30</div>
	// <div>17:00</div>
	// <div>17:30</div>
	// <div>18:00</div>
	// <div>18:30</div>
	// 				</td>
	// 				<td className='border-2 flex flex-col'>
	// 					<CalendarDay takenAppointments={[]}></CalendarDay>
	// 				</td>
	// 			</tr>
	// 		</tbody>
	// 	</table>
	// );
};

export default CalendarGrid;
