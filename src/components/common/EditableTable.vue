<template>
  <div class="editable-table">
    <table>
      <thead>
        <tr>
          <th class="col-chaos" style="width: 90px;">
            <span>混沌</span>
            <img src="@/assets/icons/swirl-blue.svg" alt="" class="th-swirl" />
          </th>
          <th class="col-name" style="width: 160px;">名称</th>
          <th class="col-desc">描述</th>
          <th class="col-action" style="width: 36px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="col-chaos">
            <input
              type="number"
              class="chaos-input"
              :value="row.number"
              @input="$emit('update', row.id, 'number', ($event.target as HTMLInputElement).value)"
              min="0"
            />
            <img src="@/assets/icons/swirl-blue.svg" alt="" class="swirl-icon" />
          </td>
          <td class="col-name">
            <input
              class="cell-input"
              :value="row.name"
              @input="$emit('update', row.id, 'name', ($event.target as HTMLInputElement).value)"
              placeholder="输入名称..."
            />
          </td>
          <td class="col-desc">
            <input
              class="cell-input"
              :value="row.description"
              @input="$emit('update', row.id, 'description', ($event.target as HTMLInputElement).value)"
              placeholder="输入描述..."
            />
          </td>
          <td class="col-action">
            <button class="btn-remove-sm" @click="$emit('remove', row.id)" title="删除行">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5"/></svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="btn-add-row" @click="$emit('add')">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5"/></svg>
      添加效应
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ChaosEffectRow } from '@/types/document'

defineProps<{
  rows: ChaosEffectRow[]
}>()

defineEmits<{
  'add': []
  'remove': [id: string]
  'update': [id: string, field: string, value: string]
}>()
</script>

<style scoped>
.editable-table {
  margin: 10px 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid #D8DFE8;
}

thead tr {
  background: linear-gradient(135deg, #0A1628, #12203A);
}

th {
  color: var(--c-light-text);
  font-size: 11px;
  font-weight: 600;
  padding: 8px 10px;
  text-align: left;
  letter-spacing: 0.3px;
}

.col-chaos {
  display: flex;
  align-items: center;
  gap: 5px;
}

.th-swirl {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

tbody tr {
  border-bottom: 1px solid #E8ECF0;
}

tbody tr:nth-child(even) {
  background: #F8FAFC;
}

tbody tr:hover {
  background: rgba(0, 102, 255, 0.03);
}

td {
  padding: 6px 10px;
  font-size: 13px;
}

td.col-chaos {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chaos-input {
  width: 36px;
  border: none;
  border-bottom: 1px solid transparent;
  padding: 2px 3px;
  font-size: 13px;
  font-weight: 600;
  color: var(--c-tech-blue);
  background: transparent;
  text-align: center;
  transition: border-color 0.15s;
}

.chaos-input:focus {
  outline: none;
  border-bottom-color: rgba(0, 102, 255, 0.3);
}

.chaos-input::-webkit-inner-spin-button,
.chaos-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.chaos-input {
  -moz-appearance: textfield;
}

.swirl-icon {
  width: 16px;
  height: 16px;
}

.cell-input {
  width: 100%;
  border: none;
  padding: 3px 2px;
  font-size: 13px;
  color: #2c3e50;
  background: transparent;
}

.cell-input:focus {
  outline: none;
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

tr:hover .btn-remove-sm {
  opacity: 1;
}

.btn-remove-sm:hover {
  color: var(--c-alert-red);
}

.btn-add-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-tech-blue);
  font-size: 12px;
  padding: 6px 12px;
  margin-top: 6px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-add-row:hover {
  background: rgba(0, 102, 255, 0.05);
}
</style>
