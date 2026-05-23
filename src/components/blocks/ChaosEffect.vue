<template>
  <div class="block block-section chaos-effect" @click="store.activeSectionId = block.id">
    <H1Title :title="block.title" :editable="true" @update:title="store.updateBlockTitle(block.id, $event)" />
    <EditableTable
      :rows="block.rows"
      @add="store.addChaosRow()"
      @remove="(id) => store.removeChaosRow(id)"
      @update="(id, field, val) => store.updateChaosRow(id, field, val)"
    />
    <WidgetRenderer v-for="w in block.widgets" :key="w.id" :widget="w" />
  </div>
</template>

<script setup lang="ts">
import type { ChaosEffectBlock } from '@/types/document'
import { useDocumentStore } from '@/stores/document'
import H1Title from '@/components/common/H1Title.vue'
import EditableTable from '@/components/common/EditableTable.vue'
import WidgetRenderer from '@/components/widgets/WidgetRenderer.vue'

defineProps<{ block: ChaosEffectBlock }>()
const store = useDocumentStore()
</script>

<style scoped>
.block {
  margin-bottom: 32px;
}
</style>
