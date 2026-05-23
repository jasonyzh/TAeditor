<template>
  <div class="widget color-text-widget" :style="paperStyle">
    <div class="paper-texture"></div>
    <div class="fold-corner"></div>
    <button class="btn-widget-remove" @click="store.removeWidget(widget.id)" title="删除">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
    </button>
    <div class="widget-body">
      <RichTextEditor
        :modelValue="widget.content"
        @update:modelValue="store.updateWidget(widget.id, 'content', $event)"
        placeholder="输入文本内容..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColorTextBlockWidget } from '@/types/document'
import { useDocumentStore } from '@/stores/document'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const props = defineProps<{ widget: ColorTextBlockWidget }>()
const store = useDocumentStore()

const paperStyle = computed(() => ({
  '--ctb-bg': props.widget.bgColor,
}))
</script>

<style scoped>
.widget {
  background: var(--ctb-bg);
  border: none;
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin: 10px 0;
  position: relative;
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.fold-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  pointer-events: none;
  z-index: 1;
}

.fold-corner::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 22px 22px;
  border-color: transparent transparent rgba(0, 0, 0, 0.06) transparent;
}

.fold-corner::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 22px 0 0 22px;
  border-color: transparent transparent transparent var(--ctb-bg);
  filter: brightness(0.97);
}

.paper-texture {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 27px,
      rgba(0, 0, 0, 0.018) 27px,
      rgba(0, 0, 0, 0.018) 28px
    );
  z-index: 0;
}

.btn-widget-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #bbb;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
  z-index: 2;
}

.widget:hover .btn-widget-remove {
  opacity: 1;
}

.btn-widget-remove:hover {
  color: var(--c-alert-red);
  background: rgba(255, 45, 85, 0.06);
}

.widget-body {
  position: relative;
  z-index: 1;
}
</style>
