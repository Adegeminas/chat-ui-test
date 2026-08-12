<script setup lang="ts">
import { type Chat } from '../types';
import { getAvatar } from '../utils/avatars';
import { messageTime } from '../utils/messageTime';

defineProps<{
	chat: Chat;
	active: boolean;
}>();

defineEmits<{
	select: [];
}>();
</script>

<template>
	<button
		type="button"
		class="flex min-h-25 w-full cursor-pointer items-center gap-1.5 border border-dotted border-slate-300 bg-white p-1.5 text-left hover:bg-sky-100"
		:class="active ? 'bg-sky-200 hover:bg-sky-200' : ''"
		@click="$emit('select')"
	>
		<div class="relative shrink-0">
			<img
				class="h-10 w-10 rounded-full object-cover"
				:src="getAvatar(chat.avatar)"
				:alt="chat.name"
			/>
			<span
				class="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-white"
				:class="chat.online ? 'bg-green-600' : 'bg-slate-400'"
				:title="chat.online ? 'Онлайн' : 'Оффлайн'"
			/>
		</div>

		<div class="min-w-0 flex-1">
			<div class="flex items-baseline justify-between gap-1">
				<span class="truncate font-semibold text-slate-800">{{ chat.name }}</span>
				<span class="hidden shrink-0 text-xs text-slate-500 @min-[200px]:inline">
					{{ messageTime(chat.lastMessageAt) }}
				</span>
			</div>
			<p class="m-0 truncate text-sm text-slate-500">{{ chat.lastMessage }}</p>
			<span class="mt-0.5 block text-xs text-slate-500 @min-[200px]:hidden">
				{{ messageTime(chat.lastMessageAt) }}
			</span>
		</div>
	</button>
</template>
