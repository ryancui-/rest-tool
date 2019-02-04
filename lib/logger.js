const chalk = require('chalk')

module.exports = {
  error(msg) {
    console.log(`\n${chalk.red(msg)}\n`)
  }
}
