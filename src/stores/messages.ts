import { defineStore } from "pinia";
import { Message } from "../types";
import { ref } from "vue";
import { api } from "../api";
import { useChatsStore } from "./chats";

const PAGE_SIZE = 50;

export const useMessagesStore = defineStore('messages', () => {
    const items = ref<Message[]>([]);
    const chatId = ref<number | null>(null);
    const page = ref(0);
    const hasMore = ref(true);
    const loading = ref(false);
    const sending = ref(false);

    const clear = () => {
        items.value = [];
        page.value = 0;
        hasMore.value = true;
        loading.value = false;
        sending.value = false;
    }

    const openChat = async (id: number) => {
        clear();
        chatId.value = id;
        await loadMore();
    }

    const loadMore = async () => {
        if (loading.value || !hasMore.value || chatId.value === null) {
            return;
        }

        const nextChat = chatId.value;
        loading.value = true;

        try {
            const nextPage = page.value + 1;
            const data = await api<Message[]>(`/messages?chatId=${nextChat}&_page=${nextPage}&_limit=${PAGE_SIZE}&_sort=createdAt&_order=desc`); 
        
            if (chatId.value !== nextChat) {
                return;
            }

            items.value = [...data.slice().reverse(), ...items.value];
            page.value = nextPage;
            hasMore.value = data.length === PAGE_SIZE;
        } catch {}
        finally {
            if (chatId.value === nextChat) {
                loading.value = false;
            }
        }
    }

    const send = async (text: string) => {
        if (chatId.value === null || sending.value) {
            return;
        }

        const activeChat = chatId.value;
        const createdAt = new Date().toISOString();
        sending.value = true;

        try {
            const saved = await api<Message>(`/messages`, {
                method: 'POST',
                body: JSON.stringify({
                    chatId: activeChat,
                    text,
                    createdAt,
                    fromMe: true,
                }),
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
            })
        } finally {
            sending.value = false;
        }
    }

    return {
        items,
        chatId,
        page,
        hasMore,
        loading,
        sending,
        openChat,
        loadMore,
        send,
    }
});