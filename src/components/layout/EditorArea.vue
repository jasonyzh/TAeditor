<template>
  <div class="editor-area">
    <div class="paper paper-scroll" ref="paperRef">
      <template v-for="(block) in store.document.blocks" :key="block.id">
        <AbnormalArchive v-if="block.type === 'abnormal-archive'" :block="block" />
        <PreInvestigation v-else-if="block.type === 'pre-investigation'" :block="block" />
        <ChaosEffect v-else-if="block.type === 'chaos-effect'" :block="block" />
        <Investigation v-else-if="block.type === 'investigation'" :block="block" />
        <Aftermath v-else-if="block.type === 'aftermath'" :block="block" />
        <FreeBlock v-else-if="block.type === 'free'" :block="block" @delete="store.removeFreeBlock(block.id)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/document'
import AbnormalArchive from '@/components/blocks/AbnormalArchive.vue'
import PreInvestigation from '@/components/blocks/PreInvestigation.vue'
import ChaosEffect from '@/components/blocks/ChaosEffect.vue'
import Investigation from '@/components/blocks/Investigation.vue'
import Aftermath from '@/components/blocks/Aftermath.vue'
import FreeBlock from '@/components/blocks/FreeBlock.vue'

const store = useDocumentStore()
const paperRef = ref<HTMLElement | null>(null)

defineExpose({ paperRef })
</script>

<style scoped>
.editor-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  padding: 20px 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(0, 102, 255, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 45, 85, 0.03) 0%, transparent 50%),
    var(--c-page-bg);
  background-attachment: fixed;
}

.paper {
  width: 210mm;
  min-height: 297mm;
  background: var(--c-paper-bg);
  border-radius: 2px;
  padding: 12mm 14mm;
  margin: 0 auto;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 12px 40px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.04);
}
</style>
