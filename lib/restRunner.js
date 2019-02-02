/** Parse config file into a internal data structure */

const axios = require('axios')
const querystring = require('querystring')
const log = require('./logger')

class RestRunner {
  constructor(config) {
    this.config = config
    this.cookie = ''
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

    // TODO: merge dafaults into current api option

    // TODO: before hook

    // FIXME: just test it
    let promise = null
    promise = axios({
      method: api.method,
      url: api.url,
      data: querystring.stringify(api.data)
    })

    const response = await promise
    console.log(response.data)
  }
}

module.exports = RestRunner
