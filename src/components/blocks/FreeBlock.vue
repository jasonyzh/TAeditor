<template>
  <div class="block block-section free-block" @click="store.activeSectionId = block.id">
    <div class="free-header">
      <H1Title :title="block.title" :editable="true" @update:title="store.updateBlockTitle(block.id, $event)" />
      <button class="btn-remove-block" @click="$emit('delete')" title="删除此区块">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
    <WidgetRenderer v-for="w in block.widgets" :key="w.id" :widget="w" />

    <div v-for="h2 in block.sections" :key="h2.id" class="h2-section" @click.stop="store.activeSectionId = h2.id">
      <H2Title
        :title="h2.title"
        :removable="true"
        @update:title="store.updateSection(h2.id, 'title', $event)"
        @delete="store.removeH2Section('free', h2.id)"
      />
      <WidgetRenderer v-for="w in h2.widgets" :key="w.id" :widget="w" />
      <div v-for="h3 in h2.children" :key="h3.id" class="h3-section" @click.stop="store.activeSectionId = h3.id">
        <H3Title
          :title="h3.title"
          :removable="true"
          @update:title="store.updateSection(h3.id, 'title', $event)"
          @delete="store.removeH3FromH2('free', h2.id, h3.id)"
        />
        <RichTextEditor
          :modelValue="h3.content"
          @update:modelValue="store.updateSection(h3.id, 'content', $event)"
        />
        <WidgetRenderer v-for="w in h3.widgets" :key="w.id" :widget="w" />
      </div>
      <button class="btn-add-sm" @click="store.addH3ToH2('free', h2.id)">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
        添加 H3 板块
      </button>
    </div>

    <div class="free-actions">
      <button class="btn-add-h2" @click="store.addH2Section('free')">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
        添加 H2 标题
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FreeBlock } from '@/types/document'
import { useDocumentStore } from '@/stores/document'
import H1Title from '@/components/common/H1Title.vue'
import H2Title from '@/components/common/H2Title.vue'
import H3Title from '@/components/common/H3Title.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import WidgetRenderer from '@/components/widgets/WidgetRenderer.vue'

defineProps<{ block: FreeBlock }>()
defineEmits<{ 'delete': [] }>()
const store = useDocumentStore()
</script>

<style scoped>
.block {
  margin-bottom: 24px;
}

.free-header {
  position: relative;
}

.free-header :deep(.h1-title) {
  width: 100%;
}

.btn-remove-block {
  position: absolute;
  top: 10px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  color: #556677;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
}

.free-header:hover .btn-remove-block {
  opacity: 1;
}

.btn-remove-block:hover {
  color: var(--c-alert-red);
}

.h2-section {
  padding-left: 6px;
  margin-bottom: 6px;
}

.h3-section {
  padding: 0 4px;
  margin-bottom: 4px;
  border-left: 2px solid transparent;
  transition: border-color 0.15s;
}

.h3-section:hover {
  border-left-color: rgba(0, 102, 255, 0.15);
}

.btn-add-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-tech-blue);
  font-size: 11px;
  padding: 3px 8px;
  margin-left: 16px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-add-sm:hover {
  background: rgba(0, 102, 255, 0.05);
}

.btn-add-h2 {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--c-alert-red);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  margin-top: 10px;
  border-radius: var(--radius-sm);
  border: 1px dashed rgba(255, 45, 85, 0.3);
  transition: background 0.15s;
}

.btn-add-h2:hover {
  background: rgba(255, 45, 85, 0.04);
}
</style>
