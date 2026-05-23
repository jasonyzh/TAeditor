<template>
  <div class="rte-wrapper" ref="wrapperRef" :class="{ focused: isFocused }">
    <div class="rte-toolbar" v-show="isFocused" @mousedown.prevent>
      <button class="tb-btn" @mousedown="exec('bold')" :class="{ active: states.bold }" title="加粗">B</button>
      <button class="tb-btn" @mousedown="exec('italic')" :class="{ active: states.italic }" title="斜体" style="font-style:italic">I</button>
      <button class="tb-btn" @mousedown="exec('underline')" :class="{ active: states.underline }" title="下划线" style="text-decoration:underline">U</button>
      <span class="tb-sep"></span>
      <button class="tb-btn" @mousedown="exec('fontSize','5')" title="大字">A<sup>+</sup></button>
      <button class="tb-btn" @mousedown="exec('fontSize','1')" title="小字">A<sub>-</sub></button>
      <button class="tb-btn" @mousedown="exec('removeFormat')" title="清除格式">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <span class="tb-sep"></span>
      <label class="tb-color-wrap" @mousedown.prevent @click="openColor">
        <span class="tb-color-indicator" :style="{ background: currentColor }"></span>
        <input ref="colorRef" type="color" class="tb-color-input" :value="currentColor" @input="onColorInput" />
      </label>
    </div>
    <div
      ref="editorRef"
      class="rte-editor"
      contenteditable="true"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      :data-placeholder="placeholder"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { setActiveEditor, saveSelection } from '@/composables/useEditorState'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: '请输入内容...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': []
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const editorRef = ref<HTMLElement | null>(null)
const colorRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const currentColor = ref('#1e3a5f')
let isComposing = false
let skipWatch = false

const states = reactive({ bold: false, italic: false, underline: false })

function refreshStates() {
  states.bold = document.queryCommandState('bold')
  states.italic = document.queryCommandState('italic')
  states.underline = document.queryCommandState('underline')
}

function onFocus() {
  isFocused.value = true
  setActiveEditor(editorRef.value)
  refreshStates()
  emit('focus')
}

function onBlur(e: FocusEvent) {
  saveSelection()
  const related = e.relatedTarget as HTMLElement | null
  if (related && wrapperRef.value?.contains(related)) return
  isFocused.value = false
  setActiveEditor(null)
}

function onInput() {
  if (isComposing) return
  syncToParent()
  refreshStates()
}

function syncToParent() {
  const el = editorRef.value
  if (!el) return
  skipWatch = true
  const html = el.innerHTML
  if (html === '<br>' || html === '<br/>' || html === '') {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', html)
  }
}

function exec(cmd: string, val?: string) {
  document.execCommand(cmd, false, val)
  refreshStates()
  syncToParent()
}

function openColor() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    saveSelection()
  }
  colorRef.value?.click()
}

function onColorInput(e: Event) {
  const color = (e.target as HTMLInputElement).value
  currentColor.value = color
  const el = editorRef.value
  if (!el) return
  el.focus()
  const sel = window.getSelection()
  if (sel && sel.rangeCount === 0) {
    const saved = (window as any).__rteSavedRange as Range | null
    if (saved) {
      sel.removeAllRanges()
      sel.addRange(saved)
    }
  }
  document.execCommand('foreColor', false, color)
  syncToParent()
}

watch(() => props.modelValue, (val) => {
  if (skipWatch) { skipWatch = false; return }
  const el = editorRef.value
  if (!el || document.activeElement === el) return
  el.innerHTML = val || ''
})

function onCompositionStart() { isComposing = true }
function onCompositionEnd() { isComposing = false; syncToParent() }

function onSelectionChange() {
  if (!isFocused.value) return
  refreshStates()
  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0 && editorRef.value?.contains(sel.anchorNode)) {
    saveSelection()
  }
}

onMounted(() => {
  const el = editorRef.value
  if (el) {
    el.innerHTML = props.modelValue || ''
    el.addEventListener('compositionstart', onCompositionStart)
    el.addEventListener('compositionend', onCompositionEnd)
  }
  document.addEventListener('selectionchange', onSelectionChange)
})

onUnmounted(() => {
  const el = editorRef.value
  if (el) {
    el.removeEventListener('compositionstart', onCompositionStart)
    el.removeEventListener('compositionend', onCompositionEnd)
  }
  document.removeEventListener('selectionchange', onSelectionChange)
})
</script>

<style scoped>
.rte-wrapper {
  position: relative;
  border-radius: var(--radius-sm);
}

.rte-editor {
  min-height: 2.6em;
  padding: 6px 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #2c3e50;
  outline: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  word-break: break-word;
  transition: border-color 0.15s, background 0.15s;
}

.rte-editor:hover {
  border-color: #e8ecf0;
}

.rte-wrapper.focused .rte-editor {
  border-color: rgba(0, 102, 255, 0.25);
  background: rgba(0, 102, 255, 0.015);
}

.rte-editor:empty::before {
  content: attr(data-placeholder);
  color: #b0bac5;
  pointer-events: none;
}

.rte-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  margin-bottom: 4px;
  background: #f5f7fa;
  border: 1px solid #dde3eb;
  border-radius: var(--radius-sm);
  flex-wrap: wrap;
}

.tb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 4px;
  color: #5a6b7d;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.12s;
}

.tb-btn:hover {
  background: rgba(0, 102, 255, 0.08);
  color: #0066ff;
}

.tb-btn.active {
  background: rgba(0, 102, 255, 0.12);
  color: #0066ff;
}

.tb-sep {
  width: 1px;
  height: 18px;
  background: #dde3eb;
  margin: 0 3px;
}

.tb-color-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.12s;
}

.tb-color-wrap:hover {
  background: rgba(0, 102, 255, 0.08);
}

.tb-color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1.5px solid #dde3eb;
  pointer-events: none;
}

.tb-color-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  pointer-events: none;
}
</style>
