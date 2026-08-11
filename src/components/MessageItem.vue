<script setup lang="ts">
import { type Message } from '../types';
import { messageTime } from '../utils/messageTime';

defineProps<{
	message: Message;
}>();
</script>

<template>
	<div class="flex" :class="message.fromMe ? 'justify-end' : 'justify-start'">
		<div
			class="max-w-[80%] rounded-xl border px-2.5 py-2 text-sm"
			:class="[
				message.fromMe
					? 'border-sky-700 bg-sky-700 text-white'
					: 'border-slate-300 bg-white text-slate-800',
				message.failed ? 'border-red-600' : '',
			]"
		>
			<p class="m-0 whitespace-pre-wrap wrap-break-word">{{ message.text }}</p>
			<div
				class="mt-1 flex justify-end gap-1.5 text-[11px]"
				:class="message.fromMe ? 'text-white/75' : 'text-slate-500'"
			>
				<span v-if="message.failed" class="font-bold text-red-600">failed</span>
				<span>{{ messageTime(message.createdAt) }}</span>
			</div>
		</div>
	</div>
</template>
