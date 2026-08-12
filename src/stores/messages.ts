import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../api';
import { useChatsStore } from './chats';
import { type Message } from '../types';

const PAGE_SIZE = 20;

export const useMessagesStore = defineStore('messages', () => {
	const items = ref<Message[]>([]);
	const chatId = ref<number | null>(null);
	const page = ref(0);
	const hasMore = ref(true);
	const loading = ref(false);
	const sending = ref(false);

	const openChat = (id: number) => {
		items.value = [];
		page.value = 0;
		hasMore.value = true;
		loading.value = false;
		sending.value = false;
		chatId.value = id;
	};

	const loadMore = async () => {
		if (loading.value || !hasMore.value || chatId.value === null) {
			return false;
		}

		const nextChat = chatId.value;
		loading.value = true;

		try {
			const nextPage = page.value + 1;
			const data = await api.getMessages(nextChat, nextPage, PAGE_SIZE);

			if (chatId.value !== nextChat) {
				return false;
			}

			items.value = [...data.slice().reverse(), ...items.value];
			page.value = nextPage;
			hasMore.value = data.length === PAGE_SIZE;
			return data.length > 0;
		} catch {
			return false;
		} finally {
			if (chatId.value === nextChat) {
				loading.value = false;
			}
		}
	};

	const send = async (text: string) => {
		if (chatId.value === null || sending.value) {
			return;
		}

		const activeChat = chatId.value;
		const createdAt = new Date().toISOString();
		sending.value = true;

		try {
			const saved = await api.sendMessage({
				chatId: activeChat,
				text,
				createdAt,
				fromMe: true,
			});

			if (chatId.value !== activeChat) {
				return;
			}

			items.value.push(saved);
			useChatsStore().updateLastMessage(activeChat, text, saved.createdAt);
		} catch {
			if (chatId.value !== activeChat) {
				return;
			}

			items.value.push({
				id: `reserved-${Date.now()}`,
				chatId: activeChat,
				text,
				createdAt,
				fromMe: true,
				failed: true,
			});
		} finally {
			sending.value = false;
		}
	};

	const clear = () => {
		items.value = [];
		chatId.value = null;
		page.value = 0;
		hasMore.value = true;
		loading.value = false;
		sending.value = false;
	};

	return {
		items,
		chatId,
		page,
		hasMore,
		loading,
		sending,
		clear,
		openChat,
		loadMore,
		send,
	};
});
