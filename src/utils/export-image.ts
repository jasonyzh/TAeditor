import html2canvas from 'html2canvas'

export async function exportToImage(element: HTMLElement, filename = '异常体档案.png') {
  element.classList.add('is-exporting')

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
    })
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    element.classList.remove('is-exporting')
  }
}
