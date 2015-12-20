'use strict'

const conf = require('./conf')
const TelegramBot = require('node-telegram-bot-api')
const Youtube = require('./lib/youtube')
const googleImages = require('./lib/google-images')
const fs = require('fs')

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

bot.onText(/\/img/, msg => {
  let chatId = msg.chat.id
  let message = msg.text.split("/img ")
  let position = -1
  let search = ''
  if (message[1].indexOf('%') > -1) {
    let text = message[1].split("% ")
    position = text[0]
    search = text[1]
  }
  else {
    search = message[1]
  }
  let opts = {
    reply_to_message_id: msg.message_id
  }
  googleImages(position, search)
  .then(image => {
    return [bot.sendPhoto(chatId, image), image]
  })
  .spread((resp, image) => {
    fs.unlinkSync(image)
  })
  .catch(err => {
    bot.sendMessage(chatId, msg.from.first_name + 'la imagen presentó un problema. Intentalo de nuevo :(' , opts);
  })
  .catch(err => {
    bot.sendMessage(chatId, msg.from.first_name + ' ' + err.message , opts);
  })
})
