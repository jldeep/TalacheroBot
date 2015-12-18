'use strict'

const conf = require('./conf')
const TelegramBot = require('node-telegram-bot-api')
const Youtube = require('./lib/youtube')

let token = conf.telegram

let bot = new TelegramBot(token, {polling: true})

bot.onText(/\/yt/, msg => {
  let chatId = msg.chat.id
  let text = msg.text.split("/yt ")
  let message = ''
  Youtube(text)
  .then(value => {
    if (value.items[0]) {
      message = 'https://www.youtube.com/watch?v=' + value.items[0].id.videoId
    }
    else {
      message = 'No se encontró ningun video :('
    }
    bot.sendMessage(chatId, message)
  })
  .catch(error => {
    let message = 'Hubo un problema desconocido :('
    bot.sendMessage(chatId, message)
  })
})
