const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID

export default class Hotjar {

  static log () {
    console.log('%cHotjar', 'color:#fff;background:#fd385b;padding:3px 5px;border-radius:4px', ...arguments)
  }

  static warn () {
    console.warn('%cHotjar', 'color:#fff;background:#fd385b;padding:3px 5px;border-radius:4px', ...arguments)
  }

  static init = () => {
    if (!HOTJAR_ID) {
      return this.warn('Hotjar not loaded because HOTJAR_ID is empty', { HOTJAR_ID })
    }

    window.hj = window.hj || function () {(window.hj.q = window.hj.q || []).push(arguments)}
    window._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 }

    const has = document.querySelector('script[src*="static.hotjar.com/c/hotjar-"]')
    if (!has) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://static.hotjar.com/c/hotjar-' + window._hjSettings.hjid + '.js?sv=' + window._hjSettings.hjsv
      document.getElementsByTagName('head')[0].appendChild(script)
      // this.log('Hotjar appended', { HOTJAR_ID })
    }
  }
}
