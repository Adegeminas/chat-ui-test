<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  send: [text: string];
}>();

const text = ref('');

const submit = () => {
  const value = text.value.trim();
  if (!value || props.disabled) {
    return;
  }

  emit('send', value);
  text.value = '';
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
};
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <textarea
      v-model="text"
      rows="2"
      placeholder="Написать сообщение…"
      :disabled="disabled"
      @keydown="onKeydown"
    />
    <button type="submit" :disabled="disabled || !text.trim()">Отправить</button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px;
  background: white;
  border-top: 1px solid black;
}

textarea {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 8px;
  resize: none;
  font: inherit;
  border: 1px solid gray;
  border-radius: 6px;
  outline: none;
}

button {
  padding: 8px 12px;
  font: inherit;
  color: black;
  background: lightblue;
  border: 1px solid gray;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

button:not(:disabled):hover {
  background: lightseagreen;
}
</style>
