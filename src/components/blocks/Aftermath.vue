<template>
  <div class="block block-section aftermath" @click="store.activeSectionId = block.id">
    <H1Title :title="block.title" :editable="true" @update:title="store.updateBlockTitle(block.id, $event)" />
    <div class="aftermath-grid">
      <div v-for="sec in block.sections" :key="sec.id" class="section-card" @click.stop="store.activeSectionId = sec.id">
        <H3Title :title="sec.title" :editable="false" :removable="false" />
        <RichTextEditor
          :modelValue="sec.content"
          @update:modelValue="store.updateSection(sec.id, 'content', $event)"
        />
        <WidgetRenderer v-for="w in sec.widgets" :key="w.id" :widget="w" />
      </div>
    </div>

    <div class="widgets-section">
      <H3Title title="申领物与异常能力" :editable="false" :removable="false" />
      <div class="widgets-list">
        <WidgetRenderer v-for="w in block.widgets" :key="w.id" :widget="w" />
      </div>
      <div class="widget-actions">
        <button class="btn-widget-add btn-red" @click="store.insertWidget(block.id, 'claim-item')">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
          添加申领物
        </button>
        <button class="btn-widget-add btn-blue" @click="store.insertWidget(block.id, 'abnormal-ability')">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
          添加异常能力
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AftermathBlock } from '@/types/document'
import { useDocumentStore } from '@/stores/document'
import H1Title from '@/components/common/H1Title.vue'
import H3Title from '@/components/common/H3Title.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import WidgetRenderer from '@/components/widgets/WidgetRenderer.vue'

defineProps<{ block: AftermathBlock }>()
const store = useDocumentStore()
</script>

<style scoped>
.block {
  margin-bottom: 24px;
}

.aftermath-grid {
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
  border-color: rgba(0, 102, 255, 0.1);
  background: white;
}

.widgets-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #D8DFE8;
}

.widgets-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.widget-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn-widget-add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-red {
  color: var(--c-alert-red);
  border: 1px solid rgba(255, 45, 85, 0.2);
  background: rgba(255, 45, 85, 0.03);
}

.btn-red:hover {
  background: rgba(255, 45, 85, 0.08);
}

.btn-blue {
  color: var(--c-tech-blue);
  border: 1px solid rgba(0, 102, 255, 0.2);
  background: rgba(0, 102, 255, 0.03);
}

.btn-blue:hover {
  background: rgba(0, 102, 255, 0.08);
}
</style>
