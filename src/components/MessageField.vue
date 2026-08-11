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
	<form
		class="flex items-end gap-2 border-t border-slate-300 bg-white p-2"
		@submit.prevent="submit"
	>
		<textarea
			v-model="text"
			rows="2"
			placeholder="Написать сообщение…"
			class="max-h-30 min-h-10 flex-1 resize-none rounded-lg border border-slate-300 px-2 py-2 text-slate-800 outline-none focus:border-sky-600"
			:disabled="disabled"
			@keydown="onKeydown"
		/>
		<button
			type="submit"
			class="cursor-pointer rounded-lg border-0 bg-sky-700 px-3 py-2 font-medium text-white hover:bg-sky-800 disabled:cursor-default disabled:opacity-50"
			:disabled="disabled || !text.trim()"
		>
			Отправить
		</button>
	</form>
</template>
