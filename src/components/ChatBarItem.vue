<script setup lang="ts">
import { Chat } from '../types';
import { getAvatar } from '../utils/avatars';
import { messageTime } from '../utils/messageTime';

defineProps<{
  chat: Chat
  active: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="item"
    :class="{ 'item--active': active }"
    @click="$emit('select')"
  >
    <div class="item__avatar-wrap">
      <img class="item__avatar" :src="getAvatar(chat.avatar)" :alt="chat.name" />
      <span
        class="item__status"
        :class="chat.online ? 'item__status--on' : 'item__status--off'"
        :title="chat.online ? 'Онлайн' : 'Оффлайн'"
      />
    </div>

    <div class="item__body">
      <div class="item__row">
        <span class="item__name">{{ chat.name }}</span>
        <span class="item__time">{{ messageTime(chat.lastMessageAt) }}</span>
      </div>
      <p class="item__preview">{{ chat.lastMessage }}</p>
    </div>
  </button>
</template>

<style scoped>
.item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 5px;
  padding: 5px;
  text-align: left;
  background: #fff;
  border: 0;
  cursor: pointer;
  height: 100px;
  border: 1px dotted gray;
}

.item:hover {
  background: lightblue;
}

.item--active {
  background: lightseagreen;
}

.item__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.item__avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.item__status {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 8px;
  height: 8px;
  border: 1px solid #fff;
  border-radius: 50%;
}

.item__status--on {
  background: green;
}

.item__status--off {
  background: orange;
}

.item__body {
  min-width: 0;
  flex: 1;
}

.item__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 3px;
  margin-bottom: 1px;
}

.item__name {
  overflow: hidden;
  font-weight: 600;
  color: black;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item__time {
  flex-shrink: 0;
  font-size: 5px;
  color: black;
}

.item__preview {
  margin: 0;
  overflow: hidden;
  font-size: 5p;
  color: black;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
