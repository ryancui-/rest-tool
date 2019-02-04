/** Parse config file into a internal data structure */

const axios = require('axios')
const querystring = require('querystring')
const url = require('url')
const log = require('./logger')
const CookieManager = require('./cookieManager')

class RestRunner {
  constructor(config) {
    this.config = config
    this.cookieManager = new CookieManager()
  }

  /** Send a request base on a full apiName */
  async send(apiName) {
    let api = null
    for (let apiGroup of this.config.api) {
      if (apiGroup[apiName]) {
        api = apiGroup[apiName]
        break
      }
    }

    if (!api) {
      log.error('Invalid API name')
      return
    }

    const parsedUrl = url.parse(api.url)
    const options = this._normalize(api)

    this._mergeOption(options, this.config.defaults)

    // TODO: before hook

    this._addCookie(options, parsedUrl.hostname)

    this._handleWwwForm(options)

    console.log('options', options)
    const promise = axios(options)
    const response = await promise

    // If has set-cookie header
    if (Array.isArray(response.headers['set-cookie'])) {
      const setCookie = response.headers['set-cookie']
      setCookie.forEach(cookie => {
        this.cookieManager.setCookie(parsedUrl.hostname, cookie)
      })
    }

    // TODO: after hook

    // TODO: like fx, you can operate the json data
    console.log(JSON.stringify(response.data, (key, value) => {
      if (typeof value === 'string'
        && (value.startsWith('{') && value.endsWith('}')
          || value.startsWith('[') && value.endsWith(']'))) {
        try {
          const recursive = JSON.parse(value)
          return recursive
        } catch (_) {
          return value
        }
      }
      return value
    }, '  '))
  }

  _normalize(api) {
    const normalized = {
      method: api.method || '',
      url: api.url || '',
      data: api.data ? JSON.parse(JSON.stringify(api.data)) : {},
      headers: api.headers ? JSON.parse(JSON.stringify(api.headers)) : {}
    }

    return normalized
  }

  /** Merge default option into api option */
  _mergeOption(options, defaults) {
    // TODO: merge options
    if (!defaults) {
      return
    }

    // Merge headers
    // TODO: handle case-sensitive
    options.headers = Object.assign({}, defaults.headers, options.headers)
  }

  /** Add cookie in request */
  _addCookie(options, hostname) {
    const cookie = this.cookieManager.getCookie(hostname)
    if (cookie) {
      options.headers['Cookie'] = cookie
    }
  }

  /** Handle application/x-www-form-urlencoded content-type */
  _handleWwwForm(options) {
    const arr = Object.keys(options.headers)
      .map(s => ([s.toLowerCase(), `${options.headers[s]}`.toLowerCase()]))
      .filter(kv => kv[0] === 'content-type' && kv[1] === 'application/x-www-form-urlencoded')

    if (arr.length > 0) {
      options.data = querystring.stringify(options.data)
    }
  }
}

module.exports = RestRunner
