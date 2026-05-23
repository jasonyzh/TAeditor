<template>
  <div class="h1-title" :class="{ editable }" @click="startEdit">
    <svg class="h1-tri" width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d="M0 0L8 6L0 12Z" fill="#FF2D55"/>
    </svg>
    <span v-if="!editing" class="title-text">{{ title }}</span>
    <input
      v-else
      ref="inputRef"
      v-model="editValue"
      class="title-input"
      @blur="confirmEdit"
      @keydown.enter="confirmEdit"
    />
    <svg class="h1-deco" viewBox="0 0 280 44" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="triFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FF2D55" stop-opacity="0"/>
          <stop offset="30%" stop-color="#FF2D55" stop-opacity="0.12"/>
        </linearGradient>
      </defs>
      <polygon points="0,44 24,0 48,44" fill="#FF2D55" fill-opacity="0.32"/>
      <polygon points="14,44 44,6 74,44" fill="#FF2D55" fill-opacity="0.24"/>
      <polygon points="40,44 62,12 84,44" fill="#FF2D55" fill-opacity="0.18"/>
      <polygon points="68,44 84,18 100,44" fill="#FF2D55" fill-opacity="0.13"/>
      <polygon points="86,44 98,22 110,44" fill="#FF2D55" fill-opacity="0.09"/>
      <polygon points="104,44 112,28 120,44" fill="#FF2D55" fill-opacity="0.05"/>
      <polygon points="116,44 122,32 128,44" fill="#FF2D55" fill-opacity="0.03"/>
      <rect x="0" y="0" width="280" height="44" fill="url(#triFade)"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps<{
  title: string
  editable?: boolean
}>()

const emit = defineEmits<{
  'update:title': [value: string]
}>()

const editing = ref(false)
const editValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function startEdit() {
  if (!props.editable) return
  if (editing.value) return
  editing.value = true
  editValue.value = props.title
  nextTick(() => inputRef.value?.focus())
}

function confirmEdit() {
  editing.value = false
  if (editValue.value.trim()) {
    emit('update:title', editValue.value.trim())
  }
}
</script>

<style scoped>
.h1-title {
  background: linear-gradient(135deg, #0A1628 0%, #12203A 100%);
  color: var(--c-light-text);
  padding: 10px 16px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 3px solid var(--c-alert-red);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: 14px;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.h1-title.editable {
  cursor: text;
}

.h1-title.editable:hover {
  background: linear-gradient(135deg, #0E1D35 0%, #162845 100%);
}

.h1-tri {
  flex-shrink: 0;
}

.title-text {
  flex: 1;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.title-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 102, 255, 0.3);
  color: var(--c-light-text);
  font-size: 18px;
  font-weight: 700;
  padding: 3px 8px;
  outline: none;
  border-radius: var(--radius-sm);
  position: relative;
  z-index: 1;
}

.h1-deco {
  position: absolute;
  top: 0;
  right: 0;
  width: 38%;
  height: 100%;
  pointer-events: none;
}
</style>
