'use strict'

const giphySearch = require('giphy-api')()
const request = require('request')
const Promise = require('bluebird')
const fs = require('fs')

Promise.promisifyAll(giphySearch)

let giphy = function (text) {
  return new Promise(
    function (resolve, reject) {
      giphySearch.random(text)
      .then(gif => {
        if(gif.data.id) {
          let path = 'files/gif/' + gif.data.id + '.gif'
          request.get(gif.data.image_url)
          .on('response', function(response) {
          })
          .pipe(fs.createWriteStream(path))
          .on('finish', () => {
            resolve(path)
          })
          .on('error', e => {
            reject({ message: 'el gif tuvo un problema.Vuelvelo a intentar :(' })
          })
        }
        else {
          reject({message: 'No se encontró ningun gif'})
        }
      })
      .catch(err => {
        reject({ message: 'el gif tuvo un problema.Vuelvelo a intentar :(' })
      })
    })
  }

module.exports = giphy
