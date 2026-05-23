import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'
import { useDocumentStore } from '@/stores/document'

export function useAutoSave() {
  const store = useDocumentStore()

  const debouncedSave = useDebounceFn(() => {
    store.saveToStorage()
  }, 500)

  watch(
    () => store.document,
    () => {
      debouncedSave()
    },
    { deep: true }
  )
}
