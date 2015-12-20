'use strict'

const conf = require('../conf')
const YouTube = require('youtube-node')
const Promise = require('bluebird')

let youTube = new YouTube()
youTube.setKey(conf.youtube)

Promise.promisifyAll(youTube)

let youtube = function (text) {
  return youTube.searchAsync(text[1], 1)
}

module.exports = youtube
