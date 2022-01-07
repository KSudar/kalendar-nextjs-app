import { Availability, WorkingShift } from "enums";

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

type TAvailability = {
  slot: number;
  available: Availability;
};

export type { TApointment, TDay, TAvailability };
