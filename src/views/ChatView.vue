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

      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ChatBarItem from '../components/ChatBarItem.vue';
import { useChatsStore } from '../stores/chats';
import { useMessagesStore } from '../stores/messages.js';
import { useScroll } from '../composables/useScroll.js';

const chats = useChatsStore();
const messages = useMessagesStore();

const chatsBlock = ref<HTMLElement | null>(null)
const chatsEdge = ref<HTMLElement | null>(null)
const messagesBlock = ref<HTMLElement | null>(null)
const messagesEdge = ref<HTMLElement | null>(null)

const selectedChat = computed(() => {
  return chats.items.find(chat => chat.id === chats.selectedId) ?? null
});

const selectChat = async (id: number) => {
  if (chats.selectedId === id) {
    return;
  }
  chats.selectChat(id);
  await messages.openChat(id);
  //
}

useScroll({
  node: chatsBlock,
  target: chatsEdge,
  onIntersect: () => chats.loadMore(),
});

onMounted(() => {
  chats.loadMore();
})

</script>

<style scoped>
.chat-page {
  display: flex;
  justify-content: center;
  min-width: 360px;
  min-height: 100%;
  background: lightgray;
}

.chat {
  display: flex;
  width: 100%;
  max-width: 1920px;
  height: 100dvh;
  overflow: hidden;
  background: white;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 35%;
  min-width: 120px;
  border-right: 1px solid black;
  background: white;
}

.sidebar__list {
  flex: 1;
  overflow-y: auto;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
