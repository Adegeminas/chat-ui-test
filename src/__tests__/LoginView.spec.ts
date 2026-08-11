import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginView from '../views/LoginView.vue';

vi.mock('vue-router', async () => {
	const actual = await vi.importActual<typeof import('vue-router')>('vue-router');
	return {
		...actual,
		useRouter: () => ({
			replace: vi.fn(),
		}),
	};
});

describe('LoginView', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('показывает ошибки валидации при пустом сабмите', async () => {
		const wrapper = mount(LoginView);

		await wrapper.find('form').trigger('submit');

		expect(wrapper.get('[data-testid="login-error"]').text()).toBe('Введите логин');
		expect(wrapper.get('[data-testid="password-error"]').text()).toBe('Введите пароль');
	});
});
