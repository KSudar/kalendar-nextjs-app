import { Availability } from "enums";
import { useEffect, useState } from "react";
import styles from "./CalendarBox.module.scss";
const CalendarBox = ({
  children,
  availability,
}: {
  children: JSX.Element | string;
  availability?: Availability;
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>();

  useEffect(() => {
    if (availability === Availability.Available) {
      setBackgroundColor("bg-green-400");
    } else if (availability === Availability.Unavailable) {
      setBackgroundColor("bg-red-400");
    } else if (availability === Availability.ReservedByUser) {
      setBackgroundColor("bg-yellow-400");
    } else if (availability === Availability.Break) {
      setBackgroundColor("bg-orange-400");
    } else {
      setBackgroundColor("bg-slate-400");
    }
  }, [availability]);
  return (
    <div className={`${styles.box} ${backgroundColor} shadow-xl`}>
      {children}
    </div>
  );
};
export default CalendarBox;
