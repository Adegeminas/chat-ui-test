import { describe, expect, it } from 'vitest';
import { isLoginValid, validateLogin } from '../utils/validateLogin';

describe('validateLogin', () => {
	it('требует логин и пароль', () => {
		const errors = validateLogin({ login: '', password: '' });

		expect(errors.login).toBe('Введите логин');
		expect(errors.password).toBe('Введите пароль');
		expect(isLoginValid(errors)).toBe(false);
	});

	it('принимает валидные данные', () => {
		const errors = validateLogin({ login: 'user', password: 'password' });

		expect(errors.login).toBe('');
		expect(errors.password).toBe('');
		expect(isLoginValid(errors)).toBe(true);
	});

	it('не принимает логин из одних пробелов', () => {
		const errors = validateLogin({ login: '   ', password: 'password' });

		expect(errors.login).toBe('Введите логин');
		expect(isLoginValid(errors)).toBe(false);
	});
});
