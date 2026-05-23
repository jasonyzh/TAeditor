import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  PageBreak,
  convertInchesToTwip,
} from 'docx'
import type {
  DocumentData,
  Block,
  Section,
  H2Section,
  Widget,
  ClaimItemWidget,
  AbnormalAbilityWidget,
  ColorTextBlockWidget,
  ChaosEffectRow,
  ListItem,
  OptionalTargetItem,
} from '@/types/document'
import { saveAs } from 'file-saver'

type DocChild = Paragraph | Table

function tri(): TextRun {
  return new TextRun({ text: '\u25B6 ', color: 'FF2D55', bold: true, font: 'Microsoft YaHei' })
}

function h1(title: string): Paragraph {
  return new Paragraph({
    children: [tri(), new TextRun({ text: title, bold: true, color: 'E0E8F4', size: 28, font: 'Microsoft YaHei' })],
    heading: HeadingLevel.HEADING_1,
    shading: { type: ShadingType.SOLID, color: '0A1628', fill: '0A1628' },
    spacing: { before: 240, after: 160 },
    border: { left: { color: 'FF2D55', size: 6, style: BorderStyle.SINGLE, space: 4 } },
  })
}

function h2(title: string): Paragraph {
  return new Paragraph({
    children: [tri(), new TextRun({ text: title, bold: true, color: '1A2A4A', size: 24, font: 'Microsoft YaHei' })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    border: { bottom: { color: 'D0D8E4', size: 1, style: BorderStyle.SINGLE, space: 2 } },
  })
}

function h3(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u2502 ', color: '0066FF', bold: true, font: 'Microsoft YaHei' }),
      new TextRun({ text: title, bold: true, color: '1E3A5F', size: 21, font: 'Microsoft YaHei' }),
    ],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    indent: { left: 120 },
  })
}

function stripHtml(html: string): string {
  if (!html) return ''
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent || ''
}

function text(content: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: stripHtml(content) || ' ', size: 20, font: 'Microsoft YaHei' })],
    spacing: { after: 60 },
  })
}

function bullet(t: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `\u2022 ${stripHtml(t)}`, size: 20, font: 'Microsoft YaHei' })],
    spacing: { after: 40 },
    indent: { left: 240 },
  })
}

function buildWidget(w: Widget): DocChild[] {
  const result: DocChild[] = []
  if (w.type === 'claim-item') {
    const cw = w as ClaimItemWidget
    result.push(new Paragraph({
      children: [
        tri(),
        new TextRun({ text: `申领物：${cw.name || '未命名'}`, bold: true, color: 'CC2444', size: 21, font: 'Microsoft YaHei' }),
      ],
      spacing: { before: 120, after: 40 },
      indent: { left: 120 },
      shading: { type: ShadingType.SOLID, color: 'FFF0F3', fill: 'FFF0F3' },
    }))
    result.push(new Paragraph({
      children: [
        new TextRun({ text: '嘉奖数量：', size: 20, font: 'Microsoft YaHei' }),
        new TextRun({ text: `${cw.medals}`, bold: true, color: 'FFB800', size: 20, font: 'Microsoft YaHei' }),
      ],
      spacing: { after: 40 },
      indent: { left: 360 },
    }))
    if (cw.description) {
      result.push(text(cw.description))
    }
  } else if (w.type === 'color-text-block') {
    const ctb = w as ColorTextBlockWidget
    if (ctb.content) {
      result.push(new Paragraph({
        children: [new TextRun({ text: stripHtml(ctb.content), size: 20, font: 'Microsoft YaHei' })],
        spacing: { before: 80, after: 60 },
        indent: { left: 120 },
        shading: { type: ShadingType.SOLID, color: 'FFF8E1', fill: 'FFF8E1' },
      }))
    }
  } else {
    const aw = w as AbnormalAbilityWidget
    result.push(new Paragraph({
      children: [
        tri(),
        new TextRun({ text: `异常能力：${aw.name || '未命名'}`, bold: true, color: '0044AA', size: 21, font: 'Microsoft YaHei' }),
      ],
      spacing: { before: 120, after: 40 },
      indent: { left: 120 },
      shading: { type: ShadingType.SOLID, color: 'F0F4FF', fill: 'F0F4FF' },
    }))
    if (aw.condition) {
      result.push(new Paragraph({
        children: [new TextRun({ text: `条件：${aw.condition}`, size: 20, font: 'Microsoft YaHei' })],
        spacing: { after: 40 },
        indent: { left: 360 },
      }))
    }
    const successFail: TextRun[] = []
    if (aw.onSuccess) successFail.push(new TextRun({ text: `成功时：${aw.onSuccess}`, size: 20, font: 'Microsoft YaHei' }))
    if (aw.onSuccess && aw.onFailure) successFail.push(new TextRun({ text: '  |  ', size: 20, font: 'Microsoft YaHei', color: 'AAAAAA' }))
    if (aw.onFailure) successFail.push(new TextRun({ text: `失败时：${aw.onFailure}`, size: 20, font: 'Microsoft YaHei' }))
    if (successFail.length) {
      result.push(new Paragraph({
        children: successFail,
        spacing: { after: 40 },
        indent: { left: 360 },
      }))
    }
  }
  return result
}

function buildWidgets(widgets?: Widget[]): DocChild[] {
  if (!widgets?.length) return []
  const result: DocChild[] = []
  for (const w of widgets) result.push(...buildWidget(w))
  return result
}

function buildSection(sec: Section): DocChild[] {
  const result: DocChild[] = [h3(sec.title)]
  if (sec.content) result.push(text(sec.content))
  result.push(...buildWidgets(sec.widgets))
  return result
}

function buildH2Section(sec: H2Section): DocChild[] {
  const result: DocChild[] = [h2(sec.title)]
  result.push(...buildWidgets(sec.widgets))
  for (const child of sec.children) result.push(...buildSection(child))
  return result
}

function cellShading(color: string) {
  return { type: ShadingType.SOLID, color, fill: color }
}

function headerCell(t: string, width: number): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: 'E0E8F4', size: 20, font: 'Microsoft YaHei' })] })],
    shading: cellShading('0A1628'),
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: 'center',
  })
}

function dataCell(t: string, width: number): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: t || ' ', size: 20, font: 'Microsoft YaHei' })] })],
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: 'center',
  })
}

function buildChaosTable(rows: ChaosEffectRow[]): Table {
  const header = new TableRow({
    children: [headerCell('混沌', 12), headerCell('名称', 30), headerCell('描述', 58)],
    tableHeader: true,
  })
  const data = rows.map(r => new TableRow({
    children: [dataCell(String(r.number), 12), dataCell(r.name, 30), dataCell(r.description, 58)],
  }))
  return new Table({
    rows: [header, ...data],
    width: { size: 100, type: WidthType.PERCENTAGE },
  })
}

function buildOptionalTargets(items: OptionalTargetItem[]): DocChild[] {
  if (!items.length) return []
  const result: DocChild[] = [new Paragraph({
    children: [
      new TextRun({ text: '\u25B6 ', color: '0066FF', bold: true, font: 'Microsoft YaHei' }),
      new TextRun({ text: '可选目标', bold: true, color: '0066FF', size: 21, font: 'Microsoft YaHei' }),
    ],
    spacing: { before: 160, after: 60 },
    indent: { left: 120 },
    shading: { type: ShadingType.SOLID, color: 'F0F8FF', fill: 'F0F8FF' },
  })]
  for (const item of items) {
    const iconText = item.iconType === 'medal' ? '[★嘉奖★]' : '[⚠申诫⚠]'
    const iconColor = item.iconType === 'medal' ? 'FFB800' : 'FF6B35'
    result.push(new Paragraph({
      children: [
        new TextRun({ text: iconText, bold: true, color: iconColor, size: 20, font: 'Microsoft YaHei' }),
        new TextRun({ text: `  ${stripHtml(item.text)}`, size: 20, font: 'Microsoft YaHei' }),
      ],
      spacing: { after: 40 },
      indent: { left: 240 },
    }))
  }
  return result
}

function buildBlock(block: Block): DocChild[] {
  const result: DocChild[] = []

  switch (block.type) {
    case 'abnormal-archive': {
      result.push(h1(block.title))
      result.push(...buildWidgets(block.widgets))
      for (const sec of block.sections) result.push(...buildSection(sec))
      break
    }

    case 'pre-investigation': {
      result.push(h1(block.title))
      result.push(...buildWidgets(block.widgets))
      result.push(h3('晨会'))
      for (const item of block.morningMeeting) result.push(bullet(item.text))
      result.push(h3('任务简报'))
      result.push(text(block.missionBrief))
      result.push(...buildOptionalTargets(block.optionalTargets))
      break
    }

    case 'chaos-effect': {
      result.push(h1(block.title))
      result.push(...buildWidgets(block.widgets))
      result.push(buildChaosTable(block.rows))
      break
    }

    case 'investigation': {
      result.push(h1(block.title))
      result.push(...buildWidgets(block.widgets))
      for (const sec of block.sections) result.push(...buildH2Section(sec))
      break
    }

    case 'aftermath': {
      result.push(h1(block.title))
      for (const sec of block.sections) result.push(...buildSection(sec))
      if (block.widgets?.length) {
        result.push(h3('申领物与异常能力'))
        result.push(...buildWidgets(block.widgets))
      }
      break
    }

    case 'free': {
      result.push(h1(block.title))
      result.push(...buildWidgets(block.widgets))
      for (const sec of block.sections) result.push(...buildH2Section(sec))
      break
    }
  }

  return result
}

export async function exportToWord(data: DocumentData, filename = '异常体档案.docx') {
  const sections: any[] = []

  for (let i = 0; i < data.blocks.length; i++) {
    const block = data.blocks[i]
    const children = buildBlock(block)

    // 异常体档案使用左右分栏
    if (block.type === 'abnormal-archive') {
      sections.push({
        properties: {
          page: {
            size: { width: convertInchesToTwip(8.27), height: convertInchesToTwip(11.69) },
            margin: { top: convertInchesToTwip(0.47), bottom: convertInchesToTwip(0.47), left: convertInchesToTwip(0.55), right: convertInchesToTwip(0.55) },
          },
          section: {
            columns: {
              space: convertInchesToTwip(0.2),
              children: [
                { width: convertInchesToTwip(3.5) },
                { width: convertInchesToTwip(3.5) },
              ],
            },
          },
        },
        children,
      })
    } else {
      // 其他区块正常单栏，不需要手动插入分页符
      sections.push({
        properties: {
          page: {
            size: { width: convertInchesToTwip(8.27), height: convertInchesToTwip(11.69) },
            margin: { top: convertInchesToTwip(0.47), bottom: convertInchesToTwip(0.47), left: convertInchesToTwip(0.55), right: convertInchesToTwip(0.55) },
          },
        },
        children,
      })
    }
  }

  const doc = new Document({
    sections,
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, filename)
}
