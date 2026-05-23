<template>
  <div class="h3-title" :class="{ editable }" @click="startEdit">
    <svg class="h3-triangle" width="6" height="9" viewBox="0 0 6 9" fill="none">
      <path d="M0 0L6 4.5L0 9Z" fill="#FF2D55"/>
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
    <button v-if="removable" class="btn-remove" @click.stop="$emit('delete')" title="删除板块">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
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
  removable: false,
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
  if (editing.value) return
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
.h3-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e3a5f;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 0 5px 8px;
  margin-top: 12px;
  margin-bottom: 6px;
  border-left: 3px solid var(--c-tech-blue);
}

.h3-title.editable {
  cursor: text;
}

.h3-title.editable:hover {
  color: #0f2944;
}

.h3-triangle {
  flex-shrink: 0;
}

.title-text {
  flex: 1;
}

.title-input {
  flex: 1;
  border: 1px solid var(--c-border-light);
  color: #1e3a5f;
  font-size: 14px;
  font-weight: 600;
  padding: 2px 6px;
  outline: none;
  border-radius: var(--radius-sm);
  background: white;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #bbb;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
}

.h3-title:hover .btn-remove {
  opacity: 1;
}

.btn-remove:hover {
  color: var(--c-alert-red);
  background: rgba(255, 45, 85, 0.08);
}
</style>
