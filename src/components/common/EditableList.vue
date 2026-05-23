<template>
  <div class="editable-list" ref="listRef">
    <svg v-if="items.length" class="list-line" :style="{ top: lineTop + 'px', height: lineH + 'px' }" aria-hidden="true">
      <line x1="5" y1="-10" x2="5" :y2="lineH + 9" stroke="#0066FF" stroke-width="2.2" stroke-linecap="round" />
    </svg>
    <div v-for="item in items" :key="item.id" class="list-item">
      <span class="bullet-ring"></span>
      <textarea
        ref="textareaRefs"
        class="item-input"
        :value="item.text"
        rows="1"
        @input="onInput(item.id, $event)"
        placeholder="输入条目..."
      ></textarea>
      <button class="btn-remove-sm" @click="$emit('remove', item.id)" title="删除">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
    <button class="btn-add-sm" @click="$emit('add')">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
      添加条目
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref as vueRef, watch } from 'vue'
import type { ListItem } from '@/types/document'

const props = defineProps<{
  items: ListItem[]
}>()

const emit = defineEmits<{
  'add': []
  'remove': [id: string]
  'update': [id: string, value: string]
}>()

const listRef = vueRef<HTMLElement | null>(null)
const textareaRefs = vueRef<HTMLTextAreaElement[]>([])
const lineTop = vueRef(0)
const lineH = vueRef(30)

function onInput(id: string, e: Event) {
  const ta = e.target as HTMLTextAreaElement
  emit('update', id, ta.value)
  autoResize(ta)
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

function resizeAll() {
  nextTick(() => {
    textareaRefs.value.forEach(autoResize)
    updateLine()
  })
}

function updateLine() {
  if (!listRef.value) return
  const items = listRef.value.querySelectorAll('.list-item')
  if (items.length === 0) return
  const first = items[0] as HTMLElement
  const last = items[items.length - 1] as HTMLElement
  const firstRing = first.querySelector('.bullet-ring') as HTMLElement
  const lastRing = last.querySelector('.bullet-ring') as HTMLElement
  if (!firstRing || !lastRing) return
  const listRect = listRef.value.getBoundingClientRect()
  const firstCy = firstRing.getBoundingClientRect().top + firstRing.offsetHeight / 2 - listRect.top
  const lastCy = lastRing.getBoundingClientRect().top + lastRing.offsetHeight / 2 - listRect.top
  lineTop.value = firstCy
  lineH.value = lastCy - firstCy
}

onMounted(resizeAll)
watch(() => props.items.length, resizeAll)
watch(() => props.items.map(i => i.text).join(''), () => nextTick(updateLine))
</script>

<style scoped>
.editable-list {
  padding: 2px 0;
  position: relative;
}

.list-line {
  position: absolute;
  left: 0;
  width: 10px;
  pointer-events: none;
  overflow: visible;
}

.list-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 3px 0;
  position: relative;
}

.bullet-ring {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2.2px solid #0066FF;
  flex-shrink: 0;
  margin-top: 7px;
  background: white;
  position: relative;
  z-index: 1;
}

.item-input {
  flex: 1;
  border: none;
  border-bottom: 1px solid transparent;
  padding: 3px 2px;
  font-size: 13px;
  line-height: 1.5;
  color: #2c3e50;
  background: transparent;
  transition: border-color 0.15s;
  resize: none;
  overflow: hidden;
  word-break: break-word;
}

.item-input:focus {
  outline: none;
  border-bottom-color: rgba(0, 102, 255, 0.25);
}

.btn-remove-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #ccc;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
  margin-top: 4px;
  flex-shrink: 0;
}

.list-item:hover .btn-remove-sm {
  opacity: 1;
}

.btn-remove-sm:hover {
  color: var(--c-alert-red);
}

.btn-add-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-tech-blue);
  font-size: 12px;
  padding: 4px 8px;
  margin-top: 4px;
  margin-left: 17px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-add-sm:hover {
  background: rgba(0, 102, 255, 0.05);
}
</style>
