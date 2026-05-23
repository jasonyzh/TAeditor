<template>
  <div class="app">
    <TopToolbar
      @export-pdf="handleExportPdf"
      @export-word="handleExportWord"
      @export-image="handleExportImage"
      @export-json="handleExportJson"
    />
    <div class="app-body">
      <div class="side-panel-wrapper">
        <SidePanel />
      </div>
      <EditorArea ref="editorAreaRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/document'
import { useAutoSave } from '@/composables/useAutoSave'
import { exportToPdf } from '@/utils/export-pdf'
import { exportToWord } from '@/utils/export-word'
import { exportToImage } from '@/utils/export-image'
import { exportToJson } from '@/utils/export-json'
import TopToolbar from '@/components/layout/TopToolbar.vue'
import SidePanel from '@/components/widgets/SidePanel.vue'
import EditorArea from '@/components/layout/EditorArea.vue'

const store = useDocumentStore()
const editorAreaRef = ref<InstanceType<typeof EditorArea> | null>(null)

useAutoSave()

function getPaperEl(): HTMLElement | null {
  return editorAreaRef.value?.paperRef ?? null
}

function generateFileName(extension: string): string {
  const moduleName = store.currentSlot?.name || '异常体档案'
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${moduleName}_${timestamp}.${extension}`
}

async function handleExportPdf() {
  const el = getPaperEl()
  if (el) await exportToPdf(el) // PDF导出使用浏览器打印，无法指定文件名
}

async function handleExportWord() {
  await exportToWord(store.document, generateFileName('docx'))
}

async function handleExportImage() {
  const el = getPaperEl()
  if (el) await exportToImage(el, generateFileName('png'))
}

function handleExportJson() {
  exportToJson(store.document, generateFileName('json'))
}
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.side-panel-wrapper {
  width: var(--side-panel-width);
  background: linear-gradient(180deg, #080E1A 0%, #0C1525 100%);
  border-right: 1px solid rgba(0, 102, 255, 0.1);
  overflow-y: auto;
  flex-shrink: 0;
  position: relative;
}

.side-panel-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: -1px;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 102, 255, 0.2), transparent, rgba(0, 102, 255, 0.1));
  pointer-events: none;
}
</style>
