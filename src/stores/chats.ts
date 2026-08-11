import { defineStore } from "pinia";
import { type Chat } from "../types";
import { ref } from "vue";
import { api } from "../api";

const PAGE_SIZE = 25

export const useChatsStore = defineStore('chats', () => {
    const items = ref<Chat[]>([]);
    const page = ref(0);
    const hasMore = ref(false);
    const loading = ref(false);
    const selectedId = ref<number | null>(null);

    const loadMore = async () => {
        if (loading.value || !hasMore.value) {
            return;
        }

        loading.value = true;

        try {
            const nextPage = page.value + 1;
            const data = await api<Chat[]>(`/chats?_page=${nextPage}&_limit=${PAGE_SIZE}&_sort=lastMessageAt&_order=desc`);

            items.value.push(...data);
            page.value = nextPage;
            hasMore.value = data.length === PAGE_SIZE;
        } catch {}
        finally {
            loading.value = false;
        }
    }

    const selectChat = (id: number) => {
        selectedId.value = id;
    }

    const updateLastMessage = (chatId: number, text: string, updated: string) => {
        const chat = items.value.find(chat => chat.id === chatId);
        if (!chat) {
            return;
        }

        chat.lastMessage = text;
        chat.lastMassageAt = updated;
        items.value = [chat, ...items.value.filter(chat => chat.id !== chatId)];
    }

    return {
        items,
        page,
        loading,
        selectedId,
        loadMore,
        selectChat,
        updateLastMessage,
    }
});