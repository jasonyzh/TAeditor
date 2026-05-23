<template>
  <div class="side-panel">
    <div class="panel-header">
      <svg class="panel-icon" width="16" height="16" viewBox="0 0 20 20" fill="#4DA6FF">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
      </svg>
      <span class="panel-title">组件面板</span>
    </div>
    <p class="panel-hint">先点击文档中的板块使其激活，再点击下方按钮插入组件</p>

    <div class="panel-section">
      <div class="panel-label">
        <svg class="label-icon" width="12" height="12" viewBox="0 0 16 16" fill="#FF2D55"><rect x="1" y="1" width="14" height="14" rx="2" stroke="#FF2D55" stroke-width="1.5" fill="rgba(255,45,85,0.1)"/><path d="M5 8h6M8 5v6" stroke="#FF2D55" stroke-width="1.5"/></svg>
        申领物
      </div>
      <div class="template-card claim-tpl">
        <div class="tpl-row">名称</div>
        <div class="tpl-row">奖章 + 数量</div>
        <div class="tpl-row">正文描述</div>
      </div>
      <button class="btn-insert btn-red" @click="insertWidget('claim-item')">
        <svg class="btn-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        插入申领物
      </button>
    </div>

    <div class="panel-section">
      <div class="panel-label">
        <svg class="label-icon" width="12" height="12" viewBox="0 0 16 16" fill="#0066FF"><path d="M8 1l2 5h5l-4 3.5 1.5 5L8 11.5 3.5 14.5 5 9.5 1 6h5z"/></svg>
        异常能力
      </div>
      <div class="template-card ability-tpl">
        <div class="tpl-row">名称</div>
        <div class="tpl-row">条件</div>
        <div class="tpl-row">成功时 / 失败时</div>
      </div>
      <button class="btn-insert btn-blue" @click="insertWidget('abnormal-ability')">
        <svg class="btn-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        插入异常能力
      </button>
    </div>

    <div class="panel-divider"></div>

    <div class="panel-section">
      <div class="panel-label">
        <svg class="label-icon" width="12" height="12" viewBox="0 0 16 16" fill="#00BBFF"><rect x="2" y="2" width="12" height="12" rx="2" stroke="#00BBFF" stroke-width="1.5" fill="rgba(0,187,255,0.1)"/><circle cx="6.5" cy="6.5" r="1.5" fill="#00BBFF"/><path d="M3 12l3-4 2 2 3-3 3 5H3z" fill="rgba(0,187,255,0.3)" stroke="#00BBFF" stroke-width="0.8"/></svg>
        标记
      </div>
      <div class="svg-pick-row" @mousedown.prevent>
        <span class="svg-pick" :class="{ active: svgType === 'xc' }" @click="svgType = 'xc'">
          普通
          <svg class="svg-thumb" viewBox="0 0 803 741" fill="none"><path d="M236.52,387.51c-125.84-121-77.9-266.75,5.42-333.58,93.87-75.28,238.44-71.43,328.71,9.54,82.27,73.8,110.12,216.34-7.1,324.64,19.86,9.23,39.67,17.12,58.07,27.21C737.24,478.7,795.07,574.13,803.13,696.66c1.83,27.7-13.74,44.1-44.48,44.15q-356.85.5-713.71,0c-32.83,0-46.69-15.11-44.76-46.32C8.73,556,80.1,456.56,217.44,398.24,224.11,395.41,232.83,395.07,236.52,387.51Z" :fill="svgColor"/></svg>
        </span>
        <span class="svg-pick" :class="{ active: svgType === 'yc' }" @click="svgType = 'yc'">
          特殊
          <svg class="svg-thumb" viewBox="0 0 546 544" fill="none"><path d="M86.91,464.82c8.41-22.36,19.59-41.87,34.64-59.19,5.94-6.83-2.8-11.07-5.85-15.41C79.34,338.64,69.17,282,87.12,222.07c20.89-69.7,69-113.49,138.56-133.91a19.27,19.27,0,0,1,4.58-.78c4.21-.19,9.47-3.68,11.43,3.56,2.16,8-4.82,6.8-8.43,7.65C206.62,104.81,183,117,161.09,133.12,83,190.52,67,311.92,127.79,386.69c4.09,5,6.52,6.43,12.08,1.74a184.75,184.75,0,0,1,25.31-17.86c8.86-5.22,18.48-9.17,29-14.3-28.44-28.39-42.76-62.1-38-102.18,3.62-30.48,17.21-56.2,40.85-76.05,47.39-39.78,115.63-37,159.43,6.19,47.38,46.72,46.55,110.57-3.3,172.64,20.15,8.43,39.21,18.25,55.46,32.54,6.28,5.53,7.81-.92,10.32-4.11,45.8-58.1,48.85-144.58,7.66-206.33-27.29-40.9-64.35-67.72-112.06-80-3.92-1-11.83.77-10-8.12,1.93-9.17,8.65-4,12.36-3.13,80.48,18.84,142.67,88.57,149.43,171.91,4,48.89-8.22,93.34-37.89,132.56-5.23,6.92-6,11.45.39,18.2,14.29,15.16,22.77,34.15,31.37,54.13,35.9-36.22,58.9-77.66,70.8-125.37.75-3,.83-6.31,2.17-9,1.45-2.95-1.26-9.22,6.28-8,7.06,1.18,5.8,5.16,4.86,10.07-6.32,32.89-18.75,63.33-36.46,91.64-10.46,16.72-22.25,32.49-36.59,46.08-5.45,5.17-7.33,9.86-5.42,17.61,2.46,10,3.06,20.44,3.72,30.75,1.05,16.43-5.48,23.73-22,25.33-3.6.34-7.25.12-10.88.12q-163.18,0-326.38,0c-29,0-37.08-6.53-32-34.61,4.26-23.35-2.32-38.61-17.83-55.57C29.73,419.85,11.14,378.89,2.31,333.81c-.72-3.64-5.95-8.66,2.22-11.13,8.86-2.69,7.62,4.16,8.63,8.66,11,49.06,33.27,92.1,68.07,128.51C82.57,461.25,84.15,462.42,86.91,464.82Z" :fill="svgColor"/></svg>
        </span>
      </div>
      <div class="svg-colors" @mousedown.prevent>
        <span class="svg-color-label">颜色</span>
        <span class="svg-color-dot" v-for="c in svgColors" :key="c" :style="{ background: c }" :class="{ active: svgColor === c }" @click="svgColor = c"></span>
      </div>
      <button class="btn-insert btn-cyan" @mousedown.prevent="insertSvg()">
        <svg class="btn-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        插入标记到文本
      </button>
      <p class="svg-hint">需先点击正文区域使编辑器获得焦点</p>
    </div>

    <div class="panel-divider"></div>

    <div class="panel-section">
      <div class="panel-label">
        <svg class="label-icon" width="12" height="12" viewBox="0 0 16 16" fill="#00BBFF"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="#00BBFF" stroke-width="1.2" fill="rgba(0,187,255,0.1)"/><path d="M5 5h6M5 7.5h6M5 10h4" stroke="#00BBFF" stroke-width="0.9"/></svg>
        文本区块
      </div>
      <div class="svg-colors" @mousedown.prevent>
        <span class="svg-color-label">背景色</span>
        <span class="svg-color-dot" v-for="c in ctbColors" :key="c" :style="{ background: c }" :class="{ active: ctbColor === c }" @click="ctbColor = c"></span>
      </div>
      <button class="btn-insert btn-cyan" @click="insertWidget('color-text-block')">
        <svg class="btn-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        插入文本区块
      </button>
    </div>

    <div class="panel-divider"></div>

    <div class="panel-section">
      <div class="panel-label">
        <svg class="label-icon" width="12" height="12" viewBox="0 0 16 16" fill="#00BBFF"><path d="M2 2h12v12H2z" stroke="#00BBFF" stroke-width="1.5" fill="none"/><path d="M5 5h6M5 8h4M5 11h5" stroke="#00BBFF" stroke-width="1"/></svg>
        新建区块
      </div>
      <div class="new-block-row">
        <input
          v-model="newBlockTitle"
          class="new-block-input"
          placeholder="输入 H1 标题..."
          @keydown.enter="addFreeBlock"
        />
        <button class="btn-add-block" @click="addFreeBlock">添加</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/document'
import { getActiveEditor, makeSvgDataUri, restoreAndFocus } from '@/composables/useEditorState'

const store = useDocumentStore()
const newBlockTitle = ref('')
const svgType = ref<'xc' | 'yc'>('xc')
const svgColor = ref('#1e3a5f')
const svgColors = ['#1e3a5f', '#000000', '#FF2D55', '#FF6B35', '#FFB800', '#0066FF', '#8B5CF6', '#10B981', '#64748B']
const ctbColor = ref('#FFF8E1')
const ctbColors = ['#FFF8E1', '#FFF3E0', '#FBE9E7', '#E8F5E9', '#E3F2FD', '#F3E5F5', '#ECEFF1', '#FFFDE7']

function insertWidget(type: 'claim-item' | 'abnormal-ability' | 'color-text-block') {
  let targetId = store.activeSectionId

  // 如果没有活跃的section，尝试自动查找PreInvestigation block
  if (!targetId) {
    const preInvBlock = store.document.blocks.find((b: any) => b.type === 'pre-investigation')
    if (preInvBlock) {
      targetId = preInvBlock.id
    }
  }

  // 如果还是找不到，才提示用户
  if (!targetId) {
    alert('请先点击一个板块使其成为活跃状态')
    return
  }

  // 执行插入
  if (type === 'color-text-block') {
    store.insertWidget(targetId, type, ctbColor.value)
  } else {
    store.insertWidget(targetId, type)
  }
}

function insertSvg() {
  const editor = restoreAndFocus()
  if (!editor) {
    alert('请先点击正文区域使编辑器获得焦点')
    return
  }
  const h = svgType.value === 'yc' ? '1.6em' : '1.1em'
  const uri = makeSvgDataUri(svgType.value, svgColor.value)
  const html = `<img src="${uri}" style="height:${h};width:auto;vertical-align:middle;display:inline;" />`
  document.execCommand('insertHTML', false, html)
  editor.dispatchEvent(new Event('input', { bubbles: true }))
}

function addFreeBlock() {
  const title = newBlockTitle.value.trim()
  if (!title) return
  store.addFreeBlock(title)
  newBlockTitle.value = ''
}
</script>

<style scoped>
.side-panel {
  padding: 14px;
  height: 100%;
  overflow-y: auto;
  min-width: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 4px;
}

.panel-icon {
  flex-shrink: 0;
}

.panel-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-light-text);
  letter-spacing: 0.3px;
}

.panel-hint {
  font-size: 11px;
  color: #4A5B70;
  margin-bottom: 18px;
  line-height: 1.5;
  padding-left: 2px;
}

.panel-section {
  margin-bottom: 18px;
}

.panel-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #6B82A6;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon {
  flex-shrink: 0;
}

.template-card {
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.claim-tpl {
  border-color: rgba(0, 102, 255, 0.2);
}

.ability-tpl {
  border-color: rgba(255, 45, 85, 0.2);
}

.tpl-row {
  font-size: 11px;
  color: #3D5068;
  padding: 2px 0;
}

.btn-insert {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  letter-spacing: 0.2px;
}

.btn-blue {
  background: rgba(0, 102, 255, 0.15);
  color: #4DA6FF;
  border: 1px solid rgba(0, 102, 255, 0.25);
}

.btn-blue:hover {
  background: rgba(0, 102, 255, 0.25);
}

.btn-red {
  background: rgba(255, 45, 85, 0.12);
  color: #FF6B8A;
  border: 1px solid rgba(255, 45, 85, 0.25);
}

.btn-red:hover {
  background: rgba(255, 45, 85, 0.22);
}

.btn-icon {
  width: 13px;
  height: 13px;
}

.panel-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.04);
  margin: 16px 0;
}

.new-block-row {
  display: flex;
  gap: 5px;
}

.new-block-input {
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 6px 8px;
  font-size: 12px;
  color: var(--c-light-text);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.15s;
}

.new-block-input:focus {
  outline: none;
  border-color: rgba(0, 102, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.new-block-input::placeholder {
  color: #3A4A5C;
}

.btn-add-block {
  padding: 6px 12px;
  background: rgba(0, 187, 255, 0.12);
  color: #4DC8FF;
  border: 1px solid rgba(0, 187, 255, 0.2);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-add-block:hover {
  background: rgba(0, 187, 255, 0.22);
}

.svg-pick-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.svg-pick {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
  color: #4A5B70;
  font-size: 12px;
  font-weight: 500;
}

.svg-thumb {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.svg-pick:hover {
  border-color: rgba(0, 187, 255, 0.25);
  background: rgba(0, 187, 255, 0.05);
}

.svg-pick.active {
  border-color: rgba(0, 187, 255, 0.4);
  background: rgba(0, 187, 255, 0.08);
  color: #4DC8FF;
}

.svg-colors {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.svg-color-label {
  font-size: 11px;
  color: #4A5B70;
  margin-right: 2px;
}

.svg-color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.12s, border-color 0.12s;
}

.svg-color-dot:hover { transform: scale(1.2); }
.svg-color-dot.active { border-color: #4DC8FF; transform: scale(1.15); }

.svg-hint {
  font-size: 10px;
  color: #3A4A5C;
  margin-top: 6px;
  line-height: 1.4;
}

.btn-cyan {
  color: #4DC8FF;
  border: 1px solid rgba(0, 187, 255, 0.2);
  background: rgba(0, 187, 255, 0.08);
}

.btn-cyan:hover {
  background: rgba(0, 187, 255, 0.18);
}
</style>
