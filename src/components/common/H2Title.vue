<template>
  <div class="h2-title" :class="{ editable }" @click="startEdit">
    <svg class="h2-triangle" width="7" height="10" viewBox="0 0 7 10" fill="none">
      <path d="M0 0L7 5L0 10Z" fill="#FF2D55"/>
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
    <button v-if="removable" class="btn-remove" @click.stop="$emit('delete')" title="删除">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  editable?: boolean
  removable?: boolean
}>(), {
  editable: true,
  removable: true,
})

const emit = defineEmits<{
  'update:title': [value: string]
  'delete': []
}>()

const editing = ref(false)
const editValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function startEdit() {
  if (!props.editable) return
  editing.value = true
  editValue.value = props.title
  nextTick(() => inputRef.value?.focus())
}

function confirmEdit() {
  editing.value = false
  emit('update:title', editValue.value)
}
</script>

<style scoped>
.h2-title {
  color: var(--h2-color);
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1.5px solid #D8DFE8;
  margin-bottom: 10px;
  margin-top: 16px;
}

.h2-title.editable {
  cursor: text;
}

.h2-triangle {
  flex-shrink: 0;
}

.title-text {
  flex: 1;
}

.title-input {
  flex: 1;
  border: 1px solid var(--c-border-light);
  color: var(--h2-color);
  font-size: 16px;
  font-weight: 600;
  padding: 2px 6px;
  outline: none;
  border-radius: var(--radius-sm);
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #bbb;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
}

.h2-title:hover .btn-remove {
  opacity: 1;
}

.btn-remove:hover {
  color: var(--c-alert-red);
  background: rgba(255, 45, 85, 0.08);
}
</style>
