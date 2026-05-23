<template>
  <div class="widget claim-widget">
    <div class="widget-header">
      <div class="header-icon">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="10" rx="2" stroke="#FF2D55" stroke-width="1.5" fill="rgba(255,45,85,0.1)"/>
          <path d="M5 7h6M5 9h4" stroke="#FF2D55" stroke-width="1"/>
        </svg>
      </div>
      <span class="header-label">申领物</span>
      <button class="btn-widget-remove" @click="store.removeWidget(widget.id)" title="删除">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
    <div class="widget-body">
      <div class="name-medal-row">
        <div class="field name-field">
          <label>名称</label>
          <input
            class="field-input"
            :value="widget.name"
            @input="store.updateWidget(widget.id, 'name', ($event.target as HTMLInputElement).value)"
            placeholder="输入名称..."
          />
        </div>
        <div class="field medal-field">
          <label>嘉奖数量</label>
          <div class="medal-row">
            <img src="@/assets/icons/medal.svg" alt="奖章" class="medal-icon" />
            <input
              type="number"
              class="field-input medal-input"
              :value="widget.medals"
              @input="store.updateWidget(widget.id, 'medals', Number(($event.target as HTMLInputElement).value))"
              min="0"
            />
          </div>
        </div>
      </div>
      <div class="field">
        <label>正文</label>
        <textarea
          class="field-textarea"
          :value="widget.description"
          @input="store.updateWidget(widget.id, 'description', ($event.target as HTMLTextAreaElement).value)"
          placeholder="输入描述..."
          rows="2"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClaimItemWidget } from '@/types/document'
import { useDocumentStore } from '@/stores/document'

defineProps<{ widget: ClaimItemWidget }>()
const store = useDocumentStore()
</script>

<style scoped>
.widget {
  border: 1px solid rgba(255, 45, 85, 0.15);
  background: linear-gradient(135deg, rgba(255, 45, 85, 0.02), rgba(255, 45, 85, 0.05));
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
  border-bottom: 1px solid rgba(255, 45, 85, 0.1);
}

.header-icon {
  display: flex;
  align-items: center;
}

.header-label {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-alert-red);
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

.name-medal-row {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.name-field {
  flex: 1;
  margin-bottom: 0;
}

.medal-field {
  width: 100px;
  flex-shrink: 0;
  margin-bottom: 0;
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
  border-color: rgba(255, 45, 85, 0.4);
}

.medal-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.medal-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.medal-input {
  width: 72px;
}

.field-textarea {
  width: 100%;
  border: 1px solid #DDE3EB;
  border-radius: var(--radius-sm);
  padding: 5px 8px;
  font-size: 13px;
  color: #2c3e50;
  background: white;
  resize: vertical;
  transition: border-color 0.15s;
}

.field-textarea:focus {
  outline: none;
  border-color: rgba(255, 45, 85, 0.4);
}
</style>
