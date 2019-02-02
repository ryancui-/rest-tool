const inquirer = require('inquirer')
const RestRunner = require('./restRunner')
const async = require('async')
const log = require('./logger')

class ViewRunner {
  constructor(config) {
    this.config = config
    // TODO: some tracking statics

    this.restRunner = new RestRunner(this.config)
  }

  run() {
    async.forever(async () => {
      const answers = await this._init()
      await this.restRunner.send(answers.api)
    }, (err) => {
      log.error(err)
    })
  }

  /** Select a API */
  _init() {
    return new Promise((resolve) => {
      inquirer.prompt([{
        type: 'list',
        name: 'api',
        message: 'select a api',
        choices: [].concat(...this.config.api.map((apiGroup) => Object.keys(apiGroup)))
          .map((apiName) => ({
            name: apiName,
            value: apiName
          }))
      }]).then((answers) => {
        resolve(answers)
      })
    })
  }
}

module.exports = ViewRunner
