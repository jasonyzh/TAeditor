export function exportToPdf(paperEl: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    paperEl.classList.add('is-exporting')

    const onAfterPrint = () => {
      cleanup()
      resolve()
    }

    const cleanup = () => {
      paperEl.classList.remove('is-exporting')
      window.removeEventListener('afterprint', onAfterPrint)
    }

    window.addEventListener('afterprint', onAfterPrint)

    setTimeout(() => {
      window.print()
      setTimeout(() => {
        cleanup()
        resolve()
      }, 1000)
    }, 100)
  })
}
