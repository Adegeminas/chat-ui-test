<template>
  <div class="page">
    <form class="card" @submit.prevent="onSubmit">
      <h1>Авторизация</h1>

      <label>
        Логин
        <input v-model="form.login" type="text" autocomplete="username" />
        <span v-if="errors.login" class="error">{{ errors.login }}</span>
      </label>

      <label>
        Пароль
        <input v-model="form.password" type="password" autocomplete="password" />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </label>

      <button type="submit" :disable="pending">
        {{ pending ? 'Отправка запроса' : 'Войти' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

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

const validate = () => {
  errors.login = '';
  errors.password = '';

  if (!form.login) {
    errors.login = 'Введите пароль';
  }
  if (!form.password) {
    errors.password = 'Введите пароль';
  }

  return !errors.login && !errors.password;
};

const onSubmit = async () => {
  apiError.value = '';
  if (!validate()) {
    return;
  }

  pending.value = true;
  try {
    await auth.login({
      login: form.login,
      password: form.password,
    });
    await router.replace({ name: 'chat' });
  } catch (e) {
    apiError.value = e.message ?? 'Неизвестная ошибка';
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped></style>
