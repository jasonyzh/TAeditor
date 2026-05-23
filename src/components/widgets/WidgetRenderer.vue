<template>
  <ClaimItemWidget v-if="widget.type === 'claim-item'" :widget="widget" />
  <AbnormalAbilityWidget v-else-if="widget.type === 'abnormal-ability'" :widget="widget" />
  <ColorTextBlockWidget v-else-if="widget.type === 'color-text-block'" :widget="widget" />
</template>

<script setup lang="ts">
import type { Widget } from '@/types/document'
import ClaimItemWidget from './ClaimItemWidget.vue'
import AbnormalAbilityWidget from './AbnormalAbilityWidget.vue'
import ColorTextBlockWidget from './ColorTextBlockWidget.vue'

defineProps<{ widget: Widget }>()
</script>
