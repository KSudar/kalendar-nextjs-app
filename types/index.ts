import { WorkingShift } from 'enums';

type TApointment = {
	timestamp: number;
	text: string;
	slot: number;
};

type TDay = {
	dayIndex: number;
	dateDisplay: string;
	dayDisplay: string;
	workingHours: WorkingShift;
};

export type { TApointment, TDay };
