import { describe, expect, it } from 'vitest';
import { messageTime } from '../utils/messageTime';

describe('messageTime', () => {
	const now = new Date('2026-08-11T15:00:00').getTime();

	it('показывает время для сегодняшнего сообщения', () => {
		expect(messageTime('2026-08-11T14:30:00', now)).toBe('Сегодня в 14:30');
	});

	it('показывает дату для более старого сообщения', () => {
		expect(messageTime('2026-08-01T10:00:00', now)).toBe('01.08');
	});

	it('возвращает заглушку для невалидной даты', () => {
		expect(messageTime('не дата', now)).toBe('Когда-то');
	});
});
