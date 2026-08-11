<template>
  <div class="chat-page">
    <div class="chat">
      <aside class="sidebar">
        <header>
          <h1>Чаты</h1>
        </header>

        <div ref="chatsBlock" class="sidebar__list">
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

      <section class="chat-block">
        <template v-if="selectedChat">
          <header class="chat-block__header">
            <img class="avatar" :src="getAvatar(selectedChat.avatar)" :alt="selectedChat.name" />
            <div>
              <h2>{{ selectedChat.name }}</h2>
              <p>{{ selectedChat.online ? 'Онлайн' : 'Оффлайн' }}</p>
            </div>
          </header>

          <div ref="messagesBlock" class="chat-block__messages">
            <div ref="messagesEdge" class="h-3" />
            <p v-if="messages.loading" class="hint">Загрузка…</p>

            <MessageItem
              v-for="message in messages.items"
              :key="message.id"
              :message="message"
            />
          </div>

          <MessageField :disabled="messages.sending" @send="onSend" />
        </template>

        <div v-else class="chat-block__empty">Выберите чат</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import ChatBarItem from '../components/ChatBarItem.vue';
import MessageItem from '../components/MessageItem.vue';
import { useChatsStore } from '../stores/chats';
import { useMessagesStore } from '../stores/messages.js';
import { useScroll } from '../composables/useScroll.js';
import { getAvatar } from '../utils/avatars';
import MessageField from '../components/MessageField.vue';

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
  if (chats.selectedId === id) {
    return;
  }
  chats.selectChat(id);
  await messages.openChat(id);
  await scrollToBottom();
};

const onSend = async (text: string) => {
  await messages.send(text);
  await scrollToBottom();
};

useScroll({
  node: chatsBlock,
  target: chatsEdge,
  onIntersect: () => chats.loadMore(),
});

useScroll({
  node: messagesBlock,
  target: messagesEdge,
  treshhold: '80px',
  onIntersect: async () => {
    const el = messagesBlock.value;
    if (!el) {
      return;
    }

    const prevHeight = el.scrollHeight;
    const prevTop = el.scrollTop;

    await messages.loadMore();
    await nextTick();

    el.scrollTop = el.scrollHeight - prevHeight + prevTop;
  },
});

onMounted(() => {
  chats.loadMore();
});
</script>

<style scoped>
.chat-page {
  display: flex;
  justify-content: center;
  min-width: 360px;
  height: 100%;
  overflow: hidden;
  background: lightgray;
}

.chat {
  display: flex;
  width: 100%;
  max-width: 1920px;
  height: 100%;
  overflow: hidden;
  background: white;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 35%;
  min-width: 120px;
  min-height: 0;
  border-right: 1px solid black;
  background: white;
}

.sidebar__list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.chat-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #f3f3f3;
}

.chat-block__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-bottom: 1px solid black;
}

.chat-block__header h2 {
  margin: 0;
  font-size: 16px;
}

.chat-block__header p {
  margin: 2px 0 0;
  font-size: 12px;
  color: gray;
}

.chat-block__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  padding: 10px;
  overflow-y: auto;
}

.chat-block__empty {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: gray;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.hint {
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: gray;
}
</style>
