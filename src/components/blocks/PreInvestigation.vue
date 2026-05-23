<template>
  <div class="block block-section pre-investigation" @click="store.activeSectionId = block.id">
    <H1Title :title="block.title" :editable="true" @update:title="store.updateBlockTitle(block.id, $event)" />

    <H3Title title="晨会" />
    <EditableList
      :items="block.morningMeeting"
      @add="store.addListItem('pre-investigation', 'morningMeeting')"
      @remove="(id) => store.removeListItem('pre-investigation', 'morningMeeting', id)"
      @update="(id, val) => store.updateListItem('pre-investigation', 'morningMeeting', id, val)"
    />

    <H3Title title="任务简报" />
    <div class="mission-brief-wrapper">
      <RichTextEditor
        :modelValue="block.missionBrief"
        @update:modelValue="handleMissionBriefUpdate"
        @focus="onMissionBriefFocus"
      />
      <WidgetRenderer v-for="w in block.widgets" :key="w.id" :widget="w" />
      <button class="insert-text-block-btn" @click="insertTextBlock" title="插入文本区块">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        插入文本区块
      </button>
    </div>

    <div class="optional-target-box">
      <div class="ot-header">
        <svg width="6" height="9" viewBox="0 0 6 9" fill="none"><path d="M0 0L6 4.5L0 9Z" fill="#FF2D55"/></svg>
        <span class="ot-title">可选目标</span>
      </div>
      <div class="ot-list">
        <div v-for="item in block.optionalTargets" :key="item.id" class="ot-item">
          <button
            class="icon-toggle"
            :class="item.iconType"
            @click="toggleIcon(item.id, item.iconType)"
            :title="item.iconType === 'medal' ? '嘉奖（点击切换）' : '申诫（点击切换）'"
          >
            <!-- 嘉奖图标 -->
            <svg v-if="item.iconType === 'medal'" width="16" height="16" viewBox="0 0 16 16" fill="none" class="icon-svg">
              <circle cx="8" cy="6" r="4.5" fill="#FFB800" stroke="#E5A600" stroke-width="0.5"/>
              <path d="M5 9.5L3.5 14.5L8 12.2L12.5 14.5L11 9.5" fill="#FFB800" stroke="#E5A600" stroke-width="0.5"/>
              <text x="8" y="8" text-anchor="middle" font-size="6" fill="#FFF" font-weight="bold">&#9733;</text>
            </svg>
            <!-- 申诫图标 -->
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" class="icon-svg">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="#FF6B35" stroke="#E55A28" stroke-width="0.5"/>
              <text x="8" y="11" text-anchor="middle" font-size="8" fill="#FFF" font-weight="bold">!</text>
            </svg>
          </button>
          <textarea
            class="ot-input"
            :value="item.text"
            rows="1"
            @input="store.updateOptionalTarget(item.id, 'text', ($event.target as HTMLTextAreaElement).value)"
            placeholder="输入目标..."
          ></textarea>
          <button class="btn-remove-sm" @click="store.removeOptionalTarget(item.id)" title="删除">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
        </div>
        <button class="btn-add-sm" @click="store.addOptionalTarget()">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
          添加目标
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PreInvestigationBlock } from '@/types/document'
import { useDocumentStore } from '@/stores/document'
import H1Title from '@/components/common/H1Title.vue'
import H3Title from '@/components/common/H3Title.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import EditableList from '@/components/common/EditableList.vue'
import WidgetRenderer from '@/components/widgets/WidgetRenderer.vue'

const props = defineProps<{ block: PreInvestigationBlock }>()
const store = useDocumentStore()

function handleMissionBriefUpdate(val: string) {
  // 通过store方法更新，遵循Vue的数据流规则
  store.updateMissionBrief(props.block.id, val)
}

function handleMissionBriefClick() {
  store.activeSectionId = props.block.id
}

function onMissionBriefFocus() {
  store.activeSectionId = props.block.id
}

function insertTextBlock() {
  // 直接使用block.id插入文本区块，绕过activeSectionId的检查
  store.insertWidget(props.block.id, 'color-text-block', '#FFF8E1')
}

function toggleIcon(id: string, current: 'medal' | 'warning') {
  const next = current === 'medal' ? 'warning' : 'medal'
  store.updateOptionalTarget(id, 'iconType', next)
}
</script>

<style scoped>
.block {
  margin-bottom: 24px;
}

.optional-target-box {
  margin-top: 16px;
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.03) 0%, rgba(0, 102, 255, 0.06) 100%);
  border: 1px solid rgba(0, 102, 255, 0.12);
  border-right: 3px solid var(--c-tech-blue);
  border-radius: var(--radius-md) var(--radius-sm) var(--radius-sm) var(--radius-md);
}

.ot-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
}

.ot-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-tech-blue);
}

.ot-list {
  padding: 0 2px;
}

.ot-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 0;
}

.icon-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
  flex-shrink: 0;
}

.icon-toggle:hover {
  background: rgba(0, 102, 255, 0.08);
}

.icon-svg {
  width: 16px;
  height: 16px;
  display: block;
}

.ot-input {
  flex: 1;
  border: none;
  border-bottom: 1px solid transparent;
  padding: 3px 2px;
  font-size: 13px;
  color: #2c3e50;
  background: transparent;
  transition: border-color 0.15s;
  resize: none;
  overflow: hidden;
  line-height: 1.5;
  word-break: break-word;
}

.ot-input:focus {
  outline: none;
  border-bottom-color: rgba(0, 102, 255, 0.3);
}

.btn-remove-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #ccc;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
}

.ot-item:hover .btn-remove-sm {
  opacity: 1;
}

.btn-remove-sm:hover {
  color: var(--c-alert-red);
  background: rgba(255, 45, 85, 0.06);
}

.btn-add-sm {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-tech-blue);
  font-size: 12px;
  padding: 4px 8px;
  margin-top: 6px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-add-sm:hover {
  background: rgba(0, 102, 255, 0.06);
}

.mission-brief-wrapper {
  position: relative;
}

.insert-text-block-btn {
  display: none;
  position: absolute;
  bottom: -30px;
  right: 10px;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  color: #4DA6FF;
  background: rgba(0, 102, 255, 0.08);
  border: 1px solid rgba(0, 102, 255, 0.2);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
  z-index: 10;
}

.mission-brief-wrapper:hover .insert-text-block-btn {
  display: flex;
}

.insert-text-block-btn:hover {
  background: rgba(0, 102, 255, 0.15);
}
</style>
