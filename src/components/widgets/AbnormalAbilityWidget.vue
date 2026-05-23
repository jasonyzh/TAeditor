<template>
  <div class="widget ability-widget">
    <div class="widget-header">
      <div class="header-icon">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 1l2.5 5H16l-4 3.5 1.5 5L8 11.5 2.5 14.5 4 9.5 0 6h5.5z" fill="rgba(0,102,255,0.1)" stroke="#0066FF" stroke-width="1"/>
        </svg>
      </div>
      <span class="header-label">异常能力</span>
      <button class="btn-widget-remove" @click="store.removeWidget(widget.id)" title="删除">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
    <div class="widget-body">
      <div class="field">
        <label>名称</label>
        <input
          class="field-input"
          :value="widget.name"
          @input="store.updateWidget(widget.id, 'name', ($event.target as HTMLInputElement).value)"
          placeholder="输入名称..."
        />
      </div>
      <div class="field">
        <label>条件</label>
        <input
          class="field-input"
          :value="widget.condition"
          @input="store.updateWidget(widget.id, 'condition', ($event.target as HTMLInputElement).value)"
          placeholder="输入条件..."
        />
      </div>
      <div class="field-row">
        <div class="field flex-1">
          <label>成功时</label>
          <input
            class="field-input"
            :value="widget.onSuccess"
            @input="store.updateWidget(widget.id, 'onSuccess', ($event.target as HTMLInputElement).value)"
            placeholder="成功效果..."
          />
        </div>
        <div class="field flex-1">
          <label>失败时</label>
          <input
            class="field-input"
            :value="widget.onFailure"
            @input="store.updateWidget(widget.id, 'onFailure', ($event.target as HTMLInputElement).value)"
            placeholder="失败效果..."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AbnormalAbilityWidget } from '@/types/document'
import { useDocumentStore } from '@/stores/document'

defineProps<{ widget: AbnormalAbilityWidget }>()
const store = useDocumentStore()
</script>

<style scoped>
.widget {
  border: 1px solid rgba(0, 102, 255, 0.12);
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.02), rgba(0, 102, 255, 0.04));
  border-radius: var(--radius-md);
  padding: 12px 14px;
  margin: 10px 0;
  position: relative;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 102, 255, 0.1);
}

.header-icon {
  display: flex;
  align-items: center;
}

.header-label {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-tech-blue);
  letter-spacing: 0.3px;
}

.btn-widget-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #ccc;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  opacity: 0;
}

.widget:hover .btn-widget-remove {
  opacity: 1;
}

.btn-widget-remove:hover {
  color: var(--c-alert-red);
  background: rgba(255, 45, 85, 0.06);
}

.field {
  margin-bottom: 8px;
}

.field label {
  display: block;
  font-size: 11px;
  color: #8899AA;
  margin-bottom: 3px;
  font-weight: 500;
}

.field-input {
  width: 100%;
  border: 1px solid #DDE3EB;
  border-radius: var(--radius-sm);
  padding: 5px 8px;
  font-size: 13px;
  color: #2c3e50;
  background: white;
  transition: border-color 0.15s;
}

.field-input:focus {
  outline: none;
  border-color: rgba(0, 102, 255, 0.35);
}

.field-row {
  display: flex;
  gap: 8px;
}

.flex-1 {
  flex: 1;
}
</style>
