<template>
  <textarea
    ref="textareaRef"
    class="editable-text"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    rows="2"
  ></textarea>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: '请输入内容...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  autoResize()
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

onMounted(() => {
  nextTick(autoResize)
})

watch(() => props.modelValue, () => {
  nextTick(autoResize)
})
</script>

<style scoped>
.editable-text {
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 6px 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #2c3e50;
  resize: none;
  overflow: hidden;
  background: transparent;
  transition: border-color 0.15s, background 0.15s;
}

.editable-text:hover {
  border-color: #e8ecf0;
}

.editable-text:focus {
  outline: none;
  border-color: rgba(0, 102, 255, 0.25);
  background: rgba(0, 102, 255, 0.015);
}

.editable-text::placeholder {
  color: #b0bac5;
}
</style>
