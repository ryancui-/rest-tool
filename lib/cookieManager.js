const Storage = require('node-storage')
const path = require('path')

/** A cookie manager based on different host */
class CookieManager {
  constructor() {
    this.cookies = {}
    // TODO: this file should be used globally
    this.store = new Storage(path.join(__dirname, '../.cache/secret.p'))
    const previous = this.store.get('cookies')
    if (previous) {
      this.cookies = previous
    }
  }

  /** Set cookie */
  setCookie(hostname, cookie) {
    const [key, value] = cookie.split(';')[0].split('=')
    let actualHost = hostname

    cookie.split(';').slice(1).map(str => str.trim()).forEach((str, index) => {
      // TODO: consider Path
      if (str.toLowerCase().startsWith('domain')) {
        actualHost = str.split('=')[1]
      }
    })

    if (!this.cookies[actualHost]) {
      this.cookies[actualHost] = {}
    }

    this.cookies[actualHost][key] = value
    this.store.put('cookies', this.cookies)
  }

  /** Get cookie */
  getCookie(hostname) {
    // TODO: consider sub domain
    Object.keys(this.cookies).forEach(host => {
      // hostname is sub-domain of host
      if (hostname.endsWith(host)) {

      }
    })
    if (this.cookies[hostname]) {
      return Object.keys(this.cookies[hostname])
        .map(k => `${k}=${this.cookies[hostname][k]}`)
        .join('; ')
    }
    return ''
  }
}

module.exports = CookieManager
