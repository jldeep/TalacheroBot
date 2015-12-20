'use strict'

const rp = require('request-promise')
const conf = require('../conf')

let openWeather = function (longitude, latitude) {
  let options = {
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {'APPID': conf.openWeather, 'lat': latitude, 'lon': longitude},
    json: true
  }

  return rp(options)
}

module.exports = openWeather
