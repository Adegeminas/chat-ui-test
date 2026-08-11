<template>
	<div class="flex min-h-full min-w-90 items-center justify-center bg-slate-200 px-4 py-8">
		<form
			class="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8"
			@submit.prevent="onSubmit"
		>
			<div>
				<h1 class="text-2xl font-semibold text-slate-800">
					Тестовое
					<a
						class="text-blue-900"
						target="__blank"
						href="https://spb.hh.ru/resume/685566c4ff0d80ff5e0039ed1f6e4279394b4e"
						>Кокарев Е.А.</a
					>
				</h1>
			</div>

			<label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
				Логин
				<input
					v-model="form.login"
					data-testid="login-input"
					type="text"
					autocomplete="user"
					class="rounded-lg border border-slate-300 px-2 py-2 font-normal text-slate-800 outline-none focus:border-sky-600"
				/>
				<span
					v-if="errors.login"
					data-testid="login-error"
					class="text-sm font-normal text-red-600"
				>
					{{ errors.login }}
				</span>
			</label>

			<label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
				Пароль
				<input
					v-model="form.password"
					data-testid="password-input"
					type="password"
					autocomplete="current-password"
					class="rounded-lg border border-slate-300 px-2 py-2 font-normal text-slate-800 outline-none focus:border-sky-600"
				/>
				<span
					v-if="errors.password"
					data-testid="password-error"
					class="text-sm font-normal text-red-600"
				>
					{{ errors.password }}
				</span>
			</label>

			<p v-if="apiError" data-testid="server-error" class="text-sm text-red-600">
				{{ apiError }}
			</p>

			<button
				type="submit"
				data-testid="submit-button"
				class="mt-3 rounded-lg bg-sky-700 px-3 py-3 font-medium text-white transition hover:bg-sky-800 disabled:cursor-default disabled:opacity-60"
				:disabled="pending"
			>
				{{ pending ? 'Входим…' : 'Войти' }}
			</button>

			<p class="text-center text-xs text-slate-400">Для входа: user / password</p>
		</form>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { isLoginValid, validateLogin } from '../utils/validateLogin';

const auth = useAuthStore();
const router = useRouter();

const pending = ref(false);
const apiError = ref('');

const form = reactive({
	login: '',
	password: '',
});

const errors = reactive({
	login: '',
	password: '',
});

const onSubmit = async () => {
	apiError.value = '';

	const nextErrors = validateLogin(form);
	errors.login = nextErrors.login;
	errors.password = nextErrors.password;

	if (!isLoginValid(nextErrors)) {
		return;
	}

	pending.value = true;
	try {
		await auth.login({
			login: form.login.trim(),
			password: form.password,
		});
		await router.replace({ name: 'chat' });
	} catch (e) {
		apiError.value = (e as Error)?.message ?? 'Неизвестная ошибка';
	} finally {
		pending.value = false;
	}
};
</script>
