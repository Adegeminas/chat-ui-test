import {defineStore} from 'pinia';
import { computed, ref } from 'vue';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
    const hasAuth = computed(() => !!token.value);
    
    const login = async () => {
        token.value = 'test';
        localStorage.setItem(TOKEN_KEY, token.value);
    }

    const logout = () => {
        token.value = null;
        localStorage.removeItem(TOKEN_KEY);
    }

    return { token, hasAuth, login, logout };
});