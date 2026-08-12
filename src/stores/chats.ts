import { defineStore } from 'pinia';
import { type Chat } from '../types';
import { ref } from 'vue';
import { api } from '../api';

const PAGE_SIZE = 10;

export const useChatsStore = defineStore('chats', () => {
	const items = ref<Chat[]>([]);
	const page = ref(0);
	const hasMore = ref(true);
	const loading = ref(false);
	const selectedId = ref<number | null>(null);

	const loadMore = async () => {
		if (loading.value || !hasMore.value) {
			return false;
		}

		loading.value = true;

		try {
			const nextPage = page.value + 1;
			const data = await api<Chat[]>(
				`/chats?_page=${nextPage}&_limit=${PAGE_SIZE}&_sort=lastMessageAt&_order=desc`,
			);

			items.value.push(...data);
			page.value = nextPage;
			hasMore.value = data.length === PAGE_SIZE;
			return data.length > 0;
		} catch {
			return false;
		} finally {
			loading.value = false;
		}
	};

	const selectChat = (id: number) => {
		selectedId.value = id;
	};

	const clear = () => {
		items.value = [];
		page.value = 0;
		hasMore.value = true;
		loading.value = false;
		selectedId.value = null;
	};

	const updateLastMessage = (chatId: number, text: string, updated: string) => {
		const index = items.value.findIndex((chat) => chat.id === chatId);
		if (index === -1) {
			return;
		}

		const chat = items.value[index];
		chat.lastMessage = text;
		chat.lastMessageAt = updated;

		if (index > 0) {
			items.value.splice(index, 1);
			items.value.unshift(chat);
		}
	};

	return {
		items,
		page,
		loading,
		selectedId,
		loadMore,
		selectChat,
		clear,
		updateLastMessage,
	};
});
