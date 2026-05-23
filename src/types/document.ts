export interface DocumentData {
  version: string
  name: string
  blocks: Block[]
}

export type Block =
  | AbnormalArchiveBlock
  | PreInvestigationBlock
  | ChaosEffectBlock
  | InvestigationBlock
  | AftermathBlock
  | FreeBlock

export interface BlockBase {
  id: string
  widgets?: Widget[]
}

export interface AbnormalArchiveBlock extends BlockBase {
  type: 'abnormal-archive'
  title: string
  sections: Section[]
}

export interface PreInvestigationBlock extends BlockBase {
  type: 'pre-investigation'
  title: string
  morningMeeting: ListItem[]
  missionBrief: string
  optionalTargets: OptionalTargetItem[]
}

export interface ChaosEffectBlock extends BlockBase {
  type: 'chaos-effect'
  title: string
  rows: ChaosEffectRow[]
}

export interface InvestigationBlock extends BlockBase {
  type: 'investigation'
  title: string
  sections: H2Section[]
}

export interface AftermathBlock extends BlockBase {
  type: 'aftermath'
  title: string
  sections: Section[]
}

export interface FreeBlock extends BlockBase {
  type: 'free'
  title: string
  sections: H2Section[]
}

export interface Section {
  id: string
  title: string
  content: string
  removable: boolean
  widgets?: Widget[]
}

export interface H2Section {
  id: string
  title: string
  children: Section[]
  widgets?: Widget[]
}

export interface ListItem {
  id: string
  text: string
}

export interface OptionalTargetItem {
  id: string
  iconType: 'medal' | 'warning'
  text: string
}

export interface ChaosEffectRow {
  id: string
  number: number
  name: string
  description: string
}

export type Widget = ClaimItemWidget | AbnormalAbilityWidget | ColorTextBlockWidget

export interface ClaimItemWidget {
  type: 'claim-item'
  id: string
  name: string
  medals: number
  description: string
}

export interface AbnormalAbilityWidget {
  type: 'abnormal-ability'
  id: string
  name: string
  condition: string
  onSuccess: string
  onFailure: string
}

export interface ColorTextBlockWidget {
  type: 'color-text-block'
  id: string
  content: string
  bgColor: string
}

export interface ModuleSlot {
  id: string
  name: string
  updatedAt: number
}
