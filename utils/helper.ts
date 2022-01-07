import { Dayjs } from 'dayjs';
import { Availability, HoursSlot, WorkingShift } from 'enums';

const getWorkingShift = (day: Dayjs) => {
	console.log(day.format('ddd DD.MM.'), day.date(), day.day());
	if (day.date() % 2 === 0 && day.day() > 0) {
		return WorkingShift.Morning;
	} else if (day.date() % 2 !== 0 && day.day() > 0 && day.day() < 6) {
		return WorkingShift.Afternoon;
	} else {
		return WorkingShift.Closed;
	}
};

const generateEmptyDay = (shift: WorkingShift) => {
	const dayAppoitmentsArray = [];
	for (let i = 0; i < 22; i++) {
		let availability;
		// console.log(WorkingShift[shift], i, HoursSlot["13:00"]);
		if (shift === WorkingShift.Closed) {
			availability = Availability.Closed;
		} else if (shift === WorkingShift.Morning && i > HoursSlot['14:00']) {
			availability = Availability.Closed;
		} else if (shift === WorkingShift.Afternoon && i < HoursSlot['13:00']) {
			availability = Availability.Closed;
		} else {
			availability = Availability.Available;
		}
		if ((i === 6 || i === 16) && availability === Availability.Available) {
			availability = Availability.Break;
		}

		dayAppoitmentsArray.push({ slot: i, available: availability });
	}
	return dayAppoitmentsArray;
};

export { generateEmptyDay, getWorkingShift };
