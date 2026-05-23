<template>
  <div class="toolbar">
    <div class="toolbar-brand">
      <svg class="brand-logo" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="#0066FF" stroke-width="1.5"/>
        <path d="M12 6l-6 3v6l6 3 6-3V9l-6-3z" fill="rgba(0,102,255,0.15)" stroke="#0066FF" stroke-width="1"/>
        <circle cx="12" cy="12" r="2" fill="#FF2D55"/>
      </svg>
      <span class="brand-text">TA Editor</span>
    </div>
    <div class="toolbar-actions">
      <div class="module-wrapper">
        <button class="tb-btn tb-module" @click="showModulePanel = !showModulePanel" title="选择模组">
          <svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
          <span class="module-name">{{ store.currentSlot?.name || '选择模组' }}</span>
          <svg class="tb-svg chevron" viewBox="0 0 20 20" fill="currentColor"><path d="M6 8l4 4 4-4"/></svg>
        </button>
        <div v-if="showModulePanel" class="module-panel">
          <div class="mp-header">
            <span>模组列表</span>
            <button class="mp-close" @click="showModulePanel = false">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
            </button>
          </div>
          <div class="mp-list">
            <div v-for="slot in store.slots" :key="slot.id" class="mp-item" :class="{ active: slot.id === store.currentSlotId }">
              <div class="mp-content" @click="switchTo(slot.id)">
                <span class="mp-name">{{ editingId === slot.id ? '' : slot.name }}</span>
                <input
                  v-if="editingId === slot.id"
                  ref="editInputRef"
                  v-model="editingName"
                  @blur="cancelEdit"
                  @keydown.enter="saveEdit(slot.id)"
                  @keydown.esc="cancelEdit"
                  @click.stop
                  class="mp-edit-input"
                />
                <span class="mp-time">{{ formatTime(slot.updatedAt) }}</span>
              </div>
              <div class="mp-actions">
                <button class="mp-rename" @click.stop="startEdit(slot)" title="重命名">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2M6 12l-2.5.5.5-2.5M4 10l6.5-6.5 2 2L6 12H4v-2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button v-if="store.slots.length > 1" class="mp-del" @click.stop="delSlot(slot.id)" title="删除">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="mp-footer">
            <input v-model="newModuleName" class="mp-input" placeholder="模组名称..." @keydown.enter="createModule" />
            <button class="mp-add" @click="createModule">新建</button>
          </div>
        </div>
      </div>
      <button class="tb-btn tb-save" @click="manualSave" title="保存">
        <svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M15 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2zm-1 12H6v-2h8v2zm0-4H6V9h8v2z"/></svg>
        <span>{{ saveLabel }}</span>
      </button>
      <div class="tb-sep"></div>
      <button class="tb-btn" @click="$emit('export-pdf')"><svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7l-5-5H4zm8 1.5L16.5 8H12V3.5z"/></svg><span>PDF</span></button>
      <button class="tb-btn" @click="$emit('export-word')"><svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 3h2l2 5 2-5h2v10h-1.5V8l-2 5h-1l-2-5v7H5V5z"/></svg><span>Word</span></button>
      <button class="tb-btn" @click="$emit('export-image')"><svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v6.59l2.3-2.3a1 1 0 011.4 0L11 13.59l1.3-1.3a1 1 0 011.4 0L16 14.6V5a1 1 0 00-1-1H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg><span>图片</span></button>
      <div class="tb-sep"></div>
      <button class="tb-btn" @click="$emit('export-json')"><svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 00-2 0v1H4a2 2 0 00-2 2v8a2 2 0 002 2h1v1a1 1 0 002 0v-1h2v1a1 1 0 002 0v-1h1a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-2 0v1H7V3zm-2 5h2v1H5V8zm8 0h2v1h-2V8z"/></svg><span>导出</span></button>
      <button class="tb-btn" @click="triggerImport"><svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 14l4-4 4 4M7 10v8M17 6H9m4-4l-4 4 4 4"/></svg><span>导入</span></button>
      <input ref="fileInputRef" type="file" accept=".json" class="hidden-input" @change="handleImport" />
      <div class="tb-sep"></div>
      <button class="tb-btn tb-danger" @click="confirmReset"><svg class="tb-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a7 7 0 00-7 7H0l3 3 3-3H4a5 5 0 015-5V2zm5.5 2.5L12 7h2a5 5 0 01-5 5v2a7 7 0 007-7h2l-3.5-3.5z"/></svg><span>重置</span></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDocumentStore } from '@/stores/document'

defineEmits<{ 'export-pdf': []; 'export-word': []; 'export-image': []; 'export-json': [] }>()

const store = useDocumentStore()
const fileInputRef = ref<HTMLInputElement | null>(null)
const showModulePanel = ref(false)
const newModuleName = ref('')
const editingId = ref<string | null>(null)
const editingName = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)

const saveLabel = computed(() => {
  if (store.saveStatus === 'saving') return '保存中...'
  if (store.saveStatus === 'saved') return '已保存 ✓'
  return '保存'
})

function manualSave() { store.saveToStorage() }
function triggerImport() { fileInputRef.value?.click() }

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { store.importJson(reader.result as string) }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

function confirmReset() {
  if (confirm('确定要重置当前模组吗？')) store.resetDocument()
}

function switchTo(id: string) {
  store.switchModule(id)
  showModulePanel.value = false
}

function delSlot(id: string) {
  const slot = store.slots.find(s => s.id === id)
  if (slot && confirm(`删除模组「${slot.name}」？`)) store.deleteModule(id)
}

function createModule() {
  const name = newModuleName.value.trim() || '新模组'
  store.createNewModule(name)
  newModuleName.value = ''
  showModulePanel.value = false
}

function startEdit(slot: { id: string; name: string }) {
  editingId.value = slot.id
  editingName.value = slot.name
  // 使用 nextTick 确保 DOM 更新后再设置焦点
  setTimeout(() => {
    editInputRef.value?.focus()
    editInputRef.value?.select()
  }, 0)
}

function saveEdit(slotId: string) {
  const newName = editingName.value.trim()
  if (newName && newName !== store.slots.find(s => s.id === slotId)?.name) {
    store.renameModule(slotId, newName)
  }
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.toolbar {
  height: var(--toolbar-height);
  background: linear-gradient(90deg, #080E1A 0%, #0F1A2E 50%, #080E1A 100%);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--c-border-blue);
  flex-shrink: 0; position: relative; z-index: 10;
}
.toolbar::after {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,102,255,0.4), transparent);
}
.toolbar-brand { display: flex; align-items: center; gap: 8px; }
.brand-logo { flex-shrink: 0; }
.brand-text { color: var(--c-light-text); font-size: 15px; font-weight: 700; letter-spacing: 0.5px; }
.toolbar-actions { display: flex; align-items: center; gap: 2px; }
.module-wrapper { position: relative; }
.tb-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 10px; color: #6B7FA0; font-size: 12px; font-weight: 500;
  border-radius: var(--radius-sm); transition: all 0.15s; letter-spacing: 0.2px;
}
.tb-btn:hover { color: var(--c-light-text); background: rgba(0,102,255,0.08); }
.tb-module { color: #8899B0; max-width: 160px; }
.tb-module:hover { color: var(--c-light-text); }
.module-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80px; }
.chevron { transition: transform 0.15s; }
.tb-save:hover { color: #4DA6FF; }
.tb-danger:hover { color: var(--c-alert-red); background: rgba(255,45,85,0.08); }
.tb-svg { width: 15px; height: 15px; flex-shrink: 0; }
.tb-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.06); margin: 0 6px; }
.hidden-input { display: none; }

.module-panel {
  position: absolute; top: 100%; left: 0; width: 320px;
  background: #0C1525; border: 1px solid rgba(0,102,255,0.2);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: 0 12px 32px rgba(0,0,0,0.4); z-index: 100; overflow: hidden;
}
.mp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; font-size: 13px; font-weight: 600;
  color: var(--c-light-text); border-bottom: 1px solid rgba(255,255,255,0.06);
}
.mp-close { color: #6B7FA0; transition: color 0.15s; }
.mp-close:hover { color: var(--c-light-text); }
.mp-list { max-height: 240px; overflow-y: auto; }
.mp-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; transition: background 0.15s;
}
.mp-item:hover { background: rgba(0,102,255,0.08); }
.mp-item.active { background: rgba(0,102,255,0.12); }
.mp-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  cursor: pointer;
}
.mp-name {
  flex: 1;
  font-size: 13px;
  color: var(--c-light-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mp-edit-input {
  flex: 1;
  border: 1px solid rgba(0,102,255,0.3);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  font-size: 13px;
  color: var(--c-light-text);
  background: rgba(0,102,255,0.05);
  min-width: 0;
}
.mp-edit-input:focus {
  outline: none;
  border-color: rgba(0,102,255,0.5);
  background: rgba(0,102,255,0.08);
}
.mp-time { font-size: 11px; color: #4A5B70; flex-shrink: 0; }
.mp-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.mp-rename {
  color: #4A5B70;
  transition: color 0.15s;
}
.mp-rename:hover { color: #4DC8FF; }
.mp-del { color: #4A5B70; transition: color 0.15s; }
.mp-del:hover { color: var(--c-alert-red); }
.mp-footer {
  display: flex; gap: 6px; padding: 10px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.mp-input {
  flex: 1; min-width: 0;
  border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-sm);
  padding: 5px 8px; font-size: 12px; color: var(--c-light-text);
  background: rgba(255,255,255,0.04);
}
.mp-input:focus { outline: none; border-color: rgba(0,102,255,0.3); }
.mp-input::placeholder { color: #3A4A5C; }
.mp-add {
  padding: 5px 12px; font-size: 12px; font-weight: 500;
  color: #4DC8FF; background: rgba(0,187,255,0.1);
  border: 1px solid rgba(0,187,255,0.2); border-radius: var(--radius-sm);
  transition: background 0.15s; white-space: nowrap;
}
.mp-add:hover { background: rgba(0,187,255,0.2); }
</style>
