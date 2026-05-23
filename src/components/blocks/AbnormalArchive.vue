<template>
  <div class="block block-section abnormal-archive" @click="store.activeSectionId = block.id">
    <H1Title :title="block.title" :editable="true" @update:title="store.updateBlockTitle(block.id, $event)" />
    <WidgetRenderer v-for="w in block.widgets" :key="w.id" :widget="w" />
    <div class="sections-grid">
      <div v-for="sec in block.sections" :key="sec.id" class="section-card" @click.stop="store.activeSectionId = sec.id">
        <H3Title
          :title="sec.title"
          :removable="sec.removable"
          @update:title="store.updateSection(sec.id, 'title', $event)"
          @delete="store.removeSection('abnormal-archive', sec.id)"
        />
        <RichTextEditor
          :modelValue="sec.content"
          @update:modelValue="store.updateSection(sec.id, 'content', $event)"
        />
        <WidgetRenderer v-for="w in sec.widgets" :key="w.id" :widget="w" />
      </div>
    </div>
    <div class="add-section-row">
      <input
        v-model="newSectionTitle"
        class="new-section-input"
        placeholder="输入新板块标题..."
        @keydown.enter="addNewSection"
      />
      <button class="btn-add" @click="addNewSection">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
        添加板块
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AbnormalArchiveBlock } from '@/types/document'
import { useDocumentStore } from '@/stores/document'
import H1Title from '@/components/common/H1Title.vue'
import H3Title from '@/components/common/H3Title.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import WidgetRenderer from '@/components/widgets/WidgetRenderer.vue'

const props = defineProps<{ block: AbnormalArchiveBlock }>()
const store = useDocumentStore()
const newSectionTitle = ref('')

function addNewSection() {
  const title = newSectionTitle.value.trim()
  if (!title) return
  store.addSection('abnormal-archive', title)
  newSectionTitle.value = ''
}
</script>

<style scoped>
.block {
  margin-bottom: 24px;
}

.sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}

.section-card {
  padding: 8px 10px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: var(--c-paper-bg-alt);
  transition: all 0.15s;
}

.section-card:hover {
  border-color: rgba(0, 102, 255, 0.12);
  background: white;
}

.add-section-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #D8DFE8;
}

.new-section-input {
  flex: 1;
  border: 1px solid var(--c-border-light);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  font-size: 13px;
  color: #2c3e50;
  background: white;
  transition: border-color 0.15s;
}

.new-section-input:focus {
  outline: none;
  border-color: rgba(0, 102, 255, 0.4);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--c-tech-blue);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 102, 255, 0.2);
  background: rgba(0, 102, 255, 0.04);
  white-space: nowrap;
  transition: all 0.15s;
}

.btn-add:hover {
  background: rgba(0, 102, 255, 0.1);
}
</style>
