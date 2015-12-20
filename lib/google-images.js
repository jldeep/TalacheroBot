'use strict'

const createParser = require('search-engine-parser')
const Promise = require('bluebird')
const fs = require('fs')
const request = require('request')
const randtoken = require('rand-token')
const Random = require('random-js')

var r = new Random(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
let googleImagesParser = createParser('google-images')
Promise.promisifyAll(googleImagesParser)

let googleImages = function (position, search) {
  let number = position
  return new Promise(
    function (resolve, reject) {
      googleImagesParser.searchAsync(search)
      .then(results => {
        if (results.length >= 1) {
          let fileName = randtoken.generate(12)
          if (number == 100) position = 0
          else if (number == 75) position = r.integer(0, 5)
          else if (number == 50) position = r.integer(5, 10)
          else if (number == 25) position = r.integer(10, 15)
          else if (number == 0) position =  r.integer(15, 20)
          //else if (number == -1) position =  r.integer(0, 20)
          else position =  r.integer(0, 20)
          let imageUrl = results[position]
          if(imageUrl.indexOf(".jpg") > -1 || imageUrl.indexOf(".jpeg") > -1 || imageUrl.indexOf(".gif") > -1 || imageUrl.indexOf(".png") > -1 || imageUrl.indexOf(".tif") > -1 || imageUrl.indexOf(".bmp") > -1) {
            let split = imageUrl.split(".")
            let type = split[split.length-1]
            if(type.indexOf("?") > -1) {
              type = type.split("?")[0];
            }
            else if(type.indexOf("&") > -1) {
              type = type.split("&")[0];
            }
            else if(type.indexOf(":") > -1) {
              type = type.split(":")[0];
            }
            else if(type.indexOf("%") > -1) {
              type = type.split("%")[0];
            }
            let path = 'files/img/' + fileName + '.' + type
            request.get(imageUrl)
            .on('response', function(response) {
            })
            .pipe(fs.createWriteStream(path))
            .on('finish', () => {
              resolve(path)
            })
            .on('error', e => {
              reject({ message: 'la imagen presentó un problema. Intentalo de nuevo :(' })
            })
          }
          else {
            reject({ message: 'la imagen presentó un problema. Intentalo de nuevo :(' })
          }
        }
        else {
          reject({ message: 'no se encontró ninguna imagen :(' })
        }
      })
      .catch(err => {
        reject({ message: 'la imagen presentó un problema. Intentalo de nuevo :(' })
      })
    })
  }

  module.exports = googleImages
