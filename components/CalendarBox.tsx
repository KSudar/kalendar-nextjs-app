import { Availability } from 'enums';
import { useEffect, useState } from 'react';
import styles from './CalendarBox.module.scss';
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
			setBackgroundColor(styles.available);
		} else if (availability === Availability.Unavailable) {
			setBackgroundColor(styles.unavailable);
		} else if (availability === Availability.ReservedByUser) {
			setBackgroundColor(styles.reserved);
		} else if (availability === Availability.Break) {
			setBackgroundColor(styles.break);
		} else if (availability === Availability.Closed) {
			setBackgroundColor(styles.closed);
		} else {
			setBackgroundColor(styles.default);
		}
	}, [availability]);
	return (
		<div className={`${styles.box} ${backgroundColor} shadow-xl`}>
			{children}
		</div>
	);
};
export default CalendarBox;
