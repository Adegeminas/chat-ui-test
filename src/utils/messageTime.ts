const sameDate = (a: Date, b: Date) => {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

const formatTime = (date: Date) => {
	return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const messageTime = (iso: string, now: number = Date.now()) => {
	const date = new Date(iso);

	if (Number.isNaN(date.getTime())) {
		return 'Когда-то';
	}

	const current = new Date(now);

	if (sameDate(date, current)) {
		return `Сегодня в ${formatTime(date)}`;
	}

	return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};
