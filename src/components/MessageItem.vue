<script setup lang="ts">
import { type Message } from '../types';
import { messageTime } from '../utils/messageTime';

defineProps<{
  message: Message;
}>();
</script>

<template>
  <div class="row" :class="message.fromMe ? 'row--mine' : 'row--theirs'">
    <div class="bubble" :class="{ 'bubble--failed': message.failed }">
      <p class="bubble__text">{{ message.text }}</p>
      <div class="bubble__meta">
        <span v-if="message.failed" class="bubble__failed">failed</span>
        <span>{{ messageTime(message.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
}

.row--mine {
  justify-content: flex-end;
}

.row--theirs {
  justify-content: flex-start;
}

.bubble {
  max-width: 80%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid gray;
  background: white;
  font-size: 14px;
}

.row--mine .bubble {
  background: lightblue;
}

.bubble--failed {
  border-color: red;
}

.bubble__text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble__meta {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
  font-size: 11px;
  color: black;
}

.bubble__failed {
  font-weight: 700;
  color: red;
}
</style>
