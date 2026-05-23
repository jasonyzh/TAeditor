import { saveAs } from 'file-saver'
import type { DocumentData } from '@/types/document'

export function exportToJson(data: DocumentData, filename = '异常体档案.json') {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  saveAs(blob, filename)
}
