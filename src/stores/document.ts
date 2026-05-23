import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  DocumentData,
  Block,
  Section,
  H2Section,
  ListItem,
  OptionalTargetItem,
  ChaosEffectRow,
  Widget,
  ClaimItemWidget,
  AbnormalAbilityWidget,
  ColorTextBlockWidget,
  ModuleSlot,
} from '@/types/document'
import { genId } from '@/utils/id'

const STORAGE_KEY = 'xfd-document-data'
const SLOTS_KEY = 'xfd-module-slots'
const CURRENT_SLOT_KEY = 'xfd-current-slot'

function makeWidget(type: 'claim-item' | 'abnormal-ability' | 'color-text-block'): Widget {
  if (type === 'claim-item') {
    return { type: 'claim-item', id: genId(), name: '', medals: 0, description: '' }
  }
  if (type === 'color-text-block') {
    return { type: 'color-text-block', id: genId(), content: '', bgColor: '#FFF8E1' }
  }
  return { type: 'abnormal-ability', id: genId(), name: '', condition: '', onSuccess: '', onFailure: '' }
}

function createDefaultDocument(name = '新建模组'): DocumentData {
  return {
    version: '1.0',
    name,
    blocks: [
      {
        type: 'abnormal-archive',
        id: genId(),
        title: '异常体档案',
        sections: [
          { id: genId(), title: '历史', content: '', removable: true },
          { id: genId(), title: '焦点', content: '', removable: true },
          { id: genId(), title: '领域', content: '', removable: true },
          { id: genId(), title: '外观', content: '', removable: true },
          { id: genId(), title: '冲动', content: '', removable: true },
          { id: genId(), title: '当前状况', content: '', removable: true },
        ],
      },
      {
        type: 'pre-investigation',
        id: genId(),
        title: '调查前夕',
        morningMeeting: [],
        missionBrief: '',
        optionalTargets: [],
        widgets: [],
      },
      {
        type: 'chaos-effect',
        id: genId(),
        title: '混沌效应',
        rows: [{ id: genId(), number: 1, name: '', description: '' }],
      },
      {
        type: 'investigation',
        id: genId(),
        title: '调查',
        sections: [],
      },
      {
        type: 'aftermath',
        id: genId(),
        title: '余波',
        sections: [
          { id: genId(), title: '异常体意捕获', content: '', removable: false },
          { id: genId(), title: '异常体已逃脱', content: '', removable: false },
          { id: genId(), title: '异常体中和', content: '', removable: false },
          { id: genId(), title: '散逸端', content: '', removable: false },
        ],
        widgets: [makeWidget('claim-item'), makeWidget('abnormal-ability')],
      },
    ],
  }
}

function ensureBlockIds(blocks: Block[]) {
  for (const b of blocks) {
    if (!b.id) b.id = genId()
  }
}

function migrateDoc(doc: DocumentData) {
  ensureBlockIds(doc.blocks)
  if (!doc.name) doc.name = '未命名模组'
  for (const b of doc.blocks) {
    if (b.type === 'abnormal-archive' && !b.title) b.title = '异常体档案'
    if (b.type === 'pre-investigation') {
      if (!b.title) b.title = '调查前夕'
      if (!b.widgets) b.widgets = []
    }
    if (b.type === 'chaos-effect' && !b.title) b.title = '混沌效应'
    if (b.type === 'investigation' && !b.title) b.title = '调查'
    if (b.type === 'aftermath' && !b.title) b.title = '余波'
    if (b.type === 'free' && !b.title) b.title = ''
  }
}

export const useDocumentStore = defineStore('document', () => {
  const slots = ref<ModuleSlot[]>(loadSlots())
  const currentSlotId = ref<string | null>(localStorage.getItem(CURRENT_SLOT_KEY) || null)
  const saveStatus = ref<'idle' | 'saving' | 'saved'>('idle')

  const document = ref<DocumentData>(loadCurrentDoc())
  const activeSectionId = ref<string | null>(null)

  const currentSlot = computed(() => slots.value.find(s => s.id === currentSlotId.value))

  function loadSlots(): ModuleSlot[] {
    try {
      const raw = localStorage.getItem(SLOTS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }

  function saveSlots() {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots.value))
  }

  function loadCurrentDoc(): DocumentData {
    if (currentSlotId.value) {
      try {
        const raw = localStorage.getItem(`xfd-module-${currentSlotId.value}`)
        if (raw) {
          const doc = JSON.parse(raw) as DocumentData
          migrateDoc(doc)
          return doc
        }
      } catch { /* fall through */ }
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const doc = JSON.parse(raw) as DocumentData
        migrateDoc(doc)
        return doc
      } catch { /* fall through */ }
    }
    const doc = createDefaultDocument()
    const slot: ModuleSlot = { id: genId(), name: '默认模组', updatedAt: Date.now() }
    slots.value.push(slot)
    currentSlotId.value = slot.id
    saveSlots()
    localStorage.setItem(CURRENT_SLOT_KEY, slot.id)
    return doc
  }

  function saveToStorage() {
    saveStatus.value = 'saving'
    try {
      if (currentSlotId.value) {
        localStorage.setItem(`xfd-module-${currentSlotId.value}`, JSON.stringify(document.value))
        const slot = slots.value.find(s => s.id === currentSlotId.value)
        if (slot) slot.updatedAt = Date.now()
        saveSlots()
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(document.value))
      }
      saveStatus.value = 'saved'
      setTimeout(() => { if (saveStatus.value === 'saved') saveStatus.value = 'idle' }, 2000)
    } catch {
      saveStatus.value = 'idle'
    }
  }

  function createNewModule(name: string) {
    const slot: ModuleSlot = { id: genId(), name, updatedAt: Date.now() }
    slots.value.push(slot)
    currentSlotId.value = slot.id
    document.value = createDefaultDocument(name)
    saveSlots()
    localStorage.setItem(CURRENT_SLOT_KEY, slot.id)
    saveToStorage()
  }

  function switchModule(slotId: string) {
    if (slotId === currentSlotId.value) return
    saveToStorage()
    currentSlotId.value = slotId
    localStorage.setItem(CURRENT_SLOT_KEY, slotId)
    const raw = localStorage.getItem(`xfd-module-${slotId}`)
    if (raw) {
      try {
        const doc = JSON.parse(raw) as DocumentData
        migrateDoc(doc)
        document.value = doc
      } catch { /* ignore */ }
    }
  }

  function deleteModule(slotId: string) {
    const idx = slots.value.findIndex(s => s.id === slotId)
    if (idx === -1) return
    slots.value.splice(idx, 1)
    localStorage.removeItem(`xfd-module-${slotId}`)
    if (currentSlotId.value === slotId) {
      if (slots.value.length > 0) {
        switchModule(slots.value[0].id)
      } else {
        createNewModule('默认模组')
      }
    }
    saveSlots()
  }

  function renameModule(slotId: string, name: string) {
    const slot = slots.value.find(s => s.id === slotId)
    if (slot) {
      slot.name = name
      if (currentSlotId.value === slotId) document.value.name = name
      saveSlots()
    }
  }

  function importJson(json: string) {
    try {
      const data = JSON.parse(json) as DocumentData
      if (data.version && Array.isArray(data.blocks)) {
        migrateDoc(data)
        document.value = data
        saveToStorage()
      }
    } catch { /* ignore */ }
  }

  function exportJson(): string {
    return JSON.stringify(document.value, null, 2)
  }

  function resetDocument() {
    document.value = createDefaultDocument(currentSlot.value?.name || '新建模组')
    saveToStorage()
  }

  function updateBlockTitle(blockId: string, title: string) {
    const block = document.value.blocks.find(b => b.id === blockId)
    if (block) block.title = title
  }

  function findBlock(predicate: (b: Block) => boolean): Block | undefined {
    return document.value.blocks.find(predicate)
  }

  function addSection(blockType: string, title: string) {
    const block = findBlock(b => b.type === blockType)
    if (block && 'sections' in block) {
      ;(block as { sections: Section[] }).sections.push({
        id: genId(), title, content: '', removable: true,
      })
    }
  }

  function removeSection(blockType: string, sectionId: string) {
    const block = findBlock(b => b.type === blockType)
    if (block && 'sections' in block) {
      const secs = (block as { sections: Section[] }).sections
      const idx = secs.findIndex(s => s.id === sectionId)
      if (idx !== -1) secs.splice(idx, 1)
    }
  }

  function updateSection(sectionId: string, field: keyof Section, value: string) {
    for (const block of document.value.blocks) {
      if ('sections' in block) {
        const secs = (block as { sections: (Section | H2Section)[] }).sections
        const sec = secs.find(s => s.id === sectionId)
        if (sec && field in sec) {
          ;(sec as unknown as Record<string, unknown>)[field] = value
          return
        }
        for (const h2 of secs as H2Section[]) {
          if (!h2.children) continue
          const child = h2.children.find(c => c.id === sectionId)
          if (child && field in child) {
            ;(child as unknown as Record<string, unknown>)[field] = value
            return
          }
        }
      }
    }
  }

  function addH2Section(blockType: string) {
    const block = findBlock(b => b.type === blockType)
    if (block && 'sections' in block) {
      ;(block as { sections: H2Section[] }).sections.push({
        id: genId(), title: '', children: [],
      })
    }
  }

  function removeH2Section(blockType: string, h2Id: string) {
    const block = findBlock(b => b.type === blockType)
    if (block && 'sections' in block) {
      const secs = (block as { sections: H2Section[] }).sections
      const idx = secs.findIndex(s => s.id === h2Id)
      if (idx !== -1) secs.splice(idx, 1)
    }
  }

  function addH3ToH2(blockType: string, h2Id: string) {
    const block = findBlock(b => b.type === blockType)
    if (block && 'sections' in block) {
      const h2 = (block as { sections: H2Section[] }).sections.find(s => s.id === h2Id)
      if (h2) h2.children.push({ id: genId(), title: '', content: '', removable: true })
    }
  }

  function removeH3FromH2(blockType: string, h2Id: string, h3Id: string) {
    const block = findBlock(b => b.type === blockType)
    if (block && 'sections' in block) {
      const h2 = (block as { sections: H2Section[] }).sections.find(s => s.id === h2Id)
      if (h2) {
        const idx = h2.children.findIndex(c => c.id === h3Id)
        if (idx !== -1) h2.children.splice(idx, 1)
      }
    }
  }

  function addListItem(blockType: string, field: string) {
    const block = findBlock(b => b.type === blockType)
    if (!block) return
    if (field === 'morningMeeting' && block.type === 'pre-investigation') {
      ;(block as { morningMeeting: ListItem[] }).morningMeeting.push({ id: genId(), text: '' })
    }
  }

  function removeListItem(blockType: string, field: string, itemId: string) {
    const block = findBlock(b => b.type === blockType)
    if (!block) return
    if (field === 'morningMeeting' && block.type === 'pre-investigation') {
      const list = (block as { morningMeeting: ListItem[] }).morningMeeting
      const idx = list.findIndex(i => i.id === itemId)
      if (idx !== -1) list.splice(idx, 1)
    }
  }

  function updateListItem(blockType: string, field: string, itemId: string, value: string) {
    const block = findBlock(b => b.type === blockType)
    if (!block) return
    if (field === 'morningMeeting' && block.type === 'pre-investigation') {
      const item = (block as { morningMeeting: ListItem[] }).morningMeeting.find(i => i.id === itemId)
      if (item) item.text = value
    }
  }

  function addOptionalTarget() {
    const block = findBlock(b => b.type === 'pre-investigation')
    if (block && block.type === 'pre-investigation') {
      block.optionalTargets.push({ id: genId(), iconType: 'medal', text: '' })
    }
  }

  function removeOptionalTarget(id: string) {
    const block = findBlock(b => b.type === 'pre-investigation')
    if (block && block.type === 'pre-investigation') {
      const idx = block.optionalTargets.findIndex(i => i.id === id)
      if (idx !== -1) block.optionalTargets.splice(idx, 1)
    }
  }

  function updateOptionalTarget(id: string, field: keyof OptionalTargetItem, value: string) {
    const block = findBlock(b => b.type === 'pre-investigation')
    if (block && block.type === 'pre-investigation') {
      const item = block.optionalTargets.find(i => i.id === id)
      if (item) (item as unknown as Record<string, unknown>)[field] = value
    }
  }

  function updateMissionBrief(blockId: string, value: string) {
    const block = findBlock(b => b.id === blockId && b.type === 'pre-investigation')
    if (block && block.type === 'pre-investigation') {
      block.missionBrief = value
    }
  }

  function addChaosRow() {
    const block = findBlock(b => b.type === 'chaos-effect')
    if (block && block.type === 'chaos-effect') {
      const maxNum = block.rows.reduce((max, r) => Math.max(max, r.number), 0)
      block.rows.push({ id: genId(), number: maxNum + 1, name: '', description: '' })
    }
  }

  function removeChaosRow(id: string) {
    const block = findBlock(b => b.type === 'chaos-effect')
    if (block && block.type === 'chaos-effect') {
      const idx = block.rows.findIndex(r => r.id === id)
      if (idx !== -1) block.rows.splice(idx, 1)
    }
  }

  function updateChaosRow(id: string, field: string, value: string | number) {
    const block = findBlock(b => b.type === 'chaos-effect')
    if (block && block.type === 'chaos-effect') {
      const row = block.rows.find(r => r.id === id)
      if (row) (row as unknown as Record<string, unknown>)[field] = value
    }
  }

  function addFreeBlock(title: string) {
    document.value.blocks.push({
      type: 'free', id: genId(), title, sections: [],
    })
  }

  function removeFreeBlock(id: string) {
    const idx = document.value.blocks.findIndex(b => b.id === id)
    if (idx !== -1) document.value.blocks.splice(idx, 1)
  }

  function insertWidget(targetId: string, widgetType: 'claim-item' | 'abnormal-ability' | 'color-text-block', bgColor?: string) {
    const w = makeWidget(widgetType)
    if (w.type === 'color-text-block' && bgColor) {
      (w as ColorTextBlockWidget).bgColor = bgColor
    }

    // 如果targetId为空，尝试使用activeSectionId
    let actualTargetId = targetId
    if (!actualTargetId && activeSectionId.value) {
      actualTargetId = activeSectionId.value
    }

    // 如果仍然为空，尝试查找PreInvestigation block作为默认目标
    if (!actualTargetId) {
      const preInvBlock = document.value.blocks.find(b => b.type === 'pre-investigation')
      if (preInvBlock) {
        actualTargetId = preInvBlock.id
      }
    }

    // 如果最后还是找不到目标，返回false
    if (!actualTargetId) {
      return false
    }

    const block = document.value.blocks.find(b => b.id === actualTargetId)
    if (block) {
      if (!block.widgets) block.widgets = []
      block.widgets.push(w)
      return true
    }
    for (const bl of document.value.blocks) {
      if (!('sections' in bl)) continue
      for (const h2 of (bl as { sections: H2Section[] }).sections) {
        if (h2.id === actualTargetId) {
          if (!h2.widgets) h2.widgets = []
          h2.widgets.push(w)
          return true
        }
      }
    }
    for (const bl of document.value.blocks) {
      if (!('sections' in bl)) continue
      for (const sec of (bl as { sections: Section[] }).sections) {
        if (sec.id === actualTargetId) {
          if (!sec.widgets) sec.widgets = []
          sec.widgets.push(w)
          return true
        }
        if ('children' in sec) {
          for (const child of (sec as H2Section).children) {
            if (child.id === actualTargetId) {
              if (!child.widgets) child.widgets = []
              child.widgets.push(w)
              return true
            }
          }
        }
      }
    }
  }

  function updateWidget(widgetId: string, field: string, value: string | number) {
    function sw(widgets: Widget[]): boolean {
      const w = widgets.find(w => w.id === widgetId)
      if (w) { (w as unknown as Record<string, unknown>)[field] = value; return true }
      return false
    }
    for (const block of document.value.blocks) {
      if (block.widgets && sw(block.widgets)) return
      if ('sections' in block) {
        for (const sec of (block as { sections: Section[] }).sections) {
          if (sec.widgets && sw(sec.widgets)) return
        }
        for (const h2 of (block as { sections: H2Section[] }).sections) {
          if (h2.widgets && sw(h2.widgets)) return
          if (h2.children) for (const c of h2.children) { if (c.widgets && sw(c.widgets)) return }
        }
      }
    }
  }

  function removeWidget(widgetId: string) {
    function sr(widgets: Widget[]): boolean {
      const idx = widgets.findIndex(w => w.id === widgetId)
      if (idx !== -1) { widgets.splice(idx, 1); return true }
      return false
    }
    for (const block of document.value.blocks) {
      if (block.widgets && sr(block.widgets)) return
      if ('sections' in block) {
        for (const sec of (block as { sections: Section[] }).sections) {
          if (sec.widgets && sr(sec.widgets)) return
        }
        for (const h2 of (block as { sections: H2Section[] }).sections) {
          if (h2.widgets && sr(h2.widgets)) return
          if (h2.children) for (const c of h2.children) { if (c.widgets && sr(c.widgets)) return }
        }
      }
    }
  }

  return {
    document, activeSectionId, slots, currentSlotId, currentSlot, saveStatus,
    saveToStorage, importJson, exportJson, resetDocument,
    createNewModule, switchModule, deleteModule, renameModule,
    updateBlockTitle, findBlock,
    addSection, removeSection, updateSection,
    addH2Section, removeH2Section, addH3ToH2, removeH3FromH2,
    addListItem, removeListItem, updateListItem,
    addOptionalTarget, removeOptionalTarget, updateOptionalTarget,
    updateMissionBrief,
    addChaosRow, removeChaosRow, updateChaosRow,
    addFreeBlock, removeFreeBlock,
    insertWidget, updateWidget, removeWidget,
  }
})
