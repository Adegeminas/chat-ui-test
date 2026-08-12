import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from '../api';
import { type LoginPayload } from '../types';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = defineStore('auth', () => {
	const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
	const hasAuth = computed(() => !!token.value);

	const login = async (payload: LoginPayload) => {
		const data = await api.login(payload);

		token.value = data.token;
		localStorage.setItem(TOKEN_KEY, data.token);
	};

	const logout = () => {
		token.value = null;
		localStorage.removeItem(TOKEN_KEY);
	};

	return { token, hasAuth, login, logout };
});
