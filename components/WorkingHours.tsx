import { WorkingShift } from "enums";
import CalendarBox from "@components/CalendarBox";
import dayjs from "dayjs";

const WorkingHours = () => {
  const createHours = () => {
    const a = dayjs().set("hours", 8).startOf("hour").format("hh:mm");
  };
  createHours();
  return (
    <>
      <CalendarBox>8:00</CalendarBox>
      <CalendarBox>8:30</CalendarBox>
      <CalendarBox>9:00</CalendarBox>
      <CalendarBox>9:30</CalendarBox>
      <CalendarBox>10:00</CalendarBox>
      <CalendarBox>10:30</CalendarBox>
      <CalendarBox>11:00</CalendarBox>
      <CalendarBox>11:30</CalendarBox>
      <CalendarBox>12:00</CalendarBox>
      <CalendarBox>12:30</CalendarBox>
      <CalendarBox>13:00</CalendarBox>
      <CalendarBox>13:30</CalendarBox>
      <CalendarBox>14:00</CalendarBox>
      <CalendarBox>14:30</CalendarBox>
      <CalendarBox>15:00</CalendarBox>
      <CalendarBox>15:30</CalendarBox>
      <CalendarBox>16:00</CalendarBox>
      <CalendarBox>16:30</CalendarBox>
      <CalendarBox>17:00</CalendarBox>
      <CalendarBox>17:30</CalendarBox>
      <CalendarBox>18:00</CalendarBox>
      <CalendarBox>18:30</CalendarBox>
    </>
  );
};
export default WorkingHours;
