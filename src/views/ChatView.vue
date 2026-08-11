<template>
  <div class="chat-page">
    <div class="chat">
      <aside class="sidebar">
        <header>
          <h1>Чаты</h1>
        </header>

        <div>
          <ChatBarItem
            v-for="chat in chats.items"
            :key="chat.id"
            :chat="chat"
            :active="chat.id === chats.selectedId"
            @select="selectChat(chat.id)"
          />
        </div>
      </aside>



      <section class="chat-block">

      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ChatBarItem from '../components/ChatBarItem.vue';
import { useChatsStore } from '../stores/chats';
import { useMessagesStore } from '../stores/messages.js';

const chats = useChatsStore();
const messages = useMessagesStore();

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
</style>
