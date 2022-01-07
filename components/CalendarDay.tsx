import { TApointment, TAvailability, TDay } from "@types";
import { generateEmptyDay } from "@utils/helper";
import { Availability, WorkingShift } from "enums";
import { useEffect, useState } from "react";
import CalendarBox from "@components/CalendarBox";

const CalendarDay = ({
  appointmentsToday,
  day,
}: {
  appointmentsToday?: TApointment[];
  day: TDay;
}) => {
  console.log(day.dayDisplay, day.dateDisplay);
  const [appointments, setAppointments] = useState<TAvailability[]>(
    generateEmptyDay(day.workingHours)
  );

  useEffect(() => {
    const apointmentsTemp = [...appointments];
    appointmentsToday?.forEach(
      (appointment) =>
        (apointmentsTemp[appointment.slot] = {
          available: Availability.Unavailable,
          slot: appointment.slot,
        })
    );
    setAppointments([...apointmentsTemp]);
  }, [day]);

  return (
    <>
      {appointments.map((appointment) => (
        <CalendarBox
          key={appointment.slot}
          availability={appointment.available}
        >
          {Availability[appointment.available]}
        </CalendarBox>
      ))}
    </>
  );
};

export default CalendarDay;
