#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const log = require('../lib/logger')
const ViewRunner = require('../lib/viewRunner')
const file = process.argv[2]

if (file) {
  const filepath = path.resolve(file)
  console.log(filepath)
  if (fs.existsSync(filepath) && filepath.endsWith('.js')) {
    const config = require(filepath)
    const viewRunner = new ViewRunner(config)
    viewRunner.run()
  } else {
    log.error('Please input a valid config javascript file path')
  }
} else {
  log.error('Please input a config file path')
}

