import CalendarDay from '@components/CalendarDay';
import { DaysOfTheWeek, WorkingShift } from 'enums';
import dayjs, { Dayjs } from 'dayjs';
import WorkingHours from '@components/WorkingHours';
import { useEffect, useState } from 'react';
import { TDay } from '@types';
import styles from './CalendarGrid.module.scss';
import { getWorkingShift } from '@utils/helper';
// import styles from ''
require('dayjs/locale/hr');

const CalendarGrid = ({ allApointments }: { allApointments: TDay[] }) => {
	const [thisWeek, setThisWeek] = useState<TDay[]>([]);

	const createDay = (dayOffset: number) => {
		const day = dayjs().locale('hr').add(dayOffset, 'day');
		return {
			dayIndex: day.day(),
			workingHours: getWorkingShift(day),
			dateDisplay: day.format('ddd DD.MM.YY.'),
			dayDisplay: DaysOfTheWeek[day.day()],
		};
	};

	useEffect(() => {
		const thisWeekTemp: TDay[] = [];
		for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
			thisWeekTemp.push(createDay(dayOffset));
		}
		setThisWeek([...thisWeekTemp]);
	}, []);

	return (
		<div className='flex text-center justify-center'>
			<div>
				<div className={`${styles.header}`}>Hours:</div>
				<div>
					<WorkingHours />
				</div>
			</div>
			{thisWeek.map((day) => (
				<div key={day.dayIndex}>
					<div className={styles.header}>
						<div>{day.dateDisplay}</div>
					</div>
					<div>
						<CalendarDay day={day} />
					</div>
				</div>
			))}
		</div>
	);
};

export default CalendarGrid;
