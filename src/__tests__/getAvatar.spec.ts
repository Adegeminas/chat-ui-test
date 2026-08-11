import { describe, expect, it } from 'vitest';
import { getAvatar } from '../utils/avatars';

describe('getAvatar', () => {
	it('возвращает аватар по ключу 1..5', () => {
		expect(getAvatar(1)).toBeTruthy();
		expect(getAvatar(5)).toBeTruthy();
		expect(getAvatar(1)).not.toBe(getAvatar(2));
	});

	it('fallback на первый аватар при неизвестном ключе', () => {
		expect(getAvatar(99)).toBe(getAvatar(1));
		expect(getAvatar(0)).toBe(getAvatar(1));
	});
});
