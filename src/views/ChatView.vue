<template>
	<div
		class="flex h-full min-w-90 items-stretch justify-center overflow-hidden bg-slate-200 text-slate-800"
	>
		<div class="flex h-full w-full max-w-[1920px] overflow-hidden bg-white">
			<aside
				class="@container flex w-[min(400px,30%)] min-w-30 min-h-0 shrink-0 flex-col border-r border-slate-300 bg-white"
			>
				<header
					class="flex flex-col items-stretch gap-1.5 border-b border-slate-300 p-2 @min-[180px]:flex-row @min-[180px]:items-center @min-[180px]:justify-between @min-[180px]:gap-2 @min-[180px]:p-2.5"
				>
					<h1
						class="m-0 min-w-0 truncate text-lg font-semibold text-slate-800 @min-[180px]:text-xl"
					>
						Чаты
					</h1>
					<button
						type="button"
						class="shrink-0 cursor-pointer rounded-lg border-0 bg-sky-700 px-2 py-1.5 text-sm font-medium whitespace-nowrap text-white hover:bg-sky-800 @min-[180px]:px-2.5"
						@click="onLogout"
					>
						Выход
					</button>
				</header>

				<div ref="chatsBlock" class="min-h-0 flex-1 overflow-y-auto">
					<ChatBarItem
						v-for="chat in chats.items"
						:key="chat.id"
						:chat="chat"
						:active="chat.id === chats.selectedId"
						@select="selectChat(chat.id)"
					/>
					<div ref="chatsEdge" class="h-3" />
				</div>
			</aside>

			<section class="@container flex min-h-0 min-w-0 flex-1 flex-col bg-slate-100">
				<template v-if="selectedChat">
					<header
						class="flex items-center gap-2.5 border-b border-slate-300 bg-white p-2.5"
					>
						<img
							class="h-7.5 w-7.5 rounded-full object-cover"
							:src="getAvatar(selectedChat.avatar)"
							:alt="selectedChat.name"
						/>
						<div>
							<h2 class="m-0 text-base font-semibold text-slate-800">
								{{ selectedChat.name }}
							</h2>
							<p class="mt-0.5 mb-0 text-xs text-slate-500">
								{{ selectedChat.online ? 'Онлайн' : 'Оффлайн' }}
							</p>
						</div>
					</header>

					<div
						ref="messagesBlock"
						class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2.5"
					>
						<div ref="messagesEdge" class="h-3" />
						<p v-if="messages.loading" class="m-0 text-center text-xs text-slate-500">
							Загрузка…
						</p>

						<MessageItem
							v-for="message in messages.items"
							:key="message.id"
							:message="message"
						/>
					</div>

					<MessageField :disabled="messages.sending" @send="onSend" />
				</template>

				<div v-else class="flex flex-1 items-center justify-center text-sm text-slate-500">
					Выберите чат
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import ChatBarItem from '../components/ChatBarItem.vue';
import MessageItem from '../components/MessageItem.vue';
import { useChatsStore } from '../stores/chats';
import { useMessagesStore } from '../stores/messages.js';
import { useAuthStore } from '../stores/auth.js';
import { useScroll } from '../composables/useScroll.js';
import { getAvatar } from '../utils/avatars';
import MessageField from '../components/MessageField.vue';

const router = useRouter();
const auth = useAuthStore();
const chats = useChatsStore();
const messages = useMessagesStore();

const chatsBlock = ref<HTMLElement | null>(null);
const chatsEdge = ref<HTMLElement | null>(null);
const messagesBlock = ref<HTMLElement | null>(null);
const messagesEdge = ref<HTMLElement | null>(null);

const selectedChat = computed(() => {
	return chats.items.find((chat) => chat.id === chats.selectedId) ?? null;
});

const scrollToBottom = async () => {
	await nextTick();
	if (messagesBlock.value) {
		messagesBlock.value.scrollTop = messagesBlock.value.scrollHeight;
	}
};

const selectChat = async (id: number) => {
	if (messages.chatId === id) {
		chats.selectChat(id);
		return;
	}
	chats.selectChat(id);
	messages.openChat(id);
	await nextTick();
	await fillMessages();
	await scrollToBottom();
};

const onSend = async (text: string) => {
	await messages.send(text);
	await scrollToBottom();
};

const onLogout = async () => {
	auth.logout();
	chats.clear();
	messages.clear();
	await router.replace({ name: 'login' });
};

useScroll({
	node: chatsBlock,
	target: chatsEdge,
	onIntersect: () => chats.loadMore(),
});

const { fill: fillMessages } = useScroll({
	node: messagesBlock,
	target: messagesEdge,
	treshhold: '80px',
	onIntersect: async () => {
		const el = messagesBlock.value;
		if (!el) {
			return false;
		}

		const prevHeight = el.scrollHeight;
		const prevTop = el.scrollTop;

		const loaded = await messages.loadMore();
		await nextTick();

		el.scrollTop = el.scrollHeight - prevHeight + prevTop;
		return loaded;
	},
});
</script>
