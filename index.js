// 아 귀차느니까 걍 대충 만들꺼임
const { Client } = require('discord.js')
const { get } = require('superagent')
const resize = require('resize-img')

class eClient extends Client {
  constructor () {
    super()
    this.supportExts = ['jpeg', 'jpg', 'png']

    this.login(process.env.TOKEN)
    this.on('message', async (msg) => {
      if (msg.author.bot) return
      if (msg.channel.id !== '779684467975258112') return

      const attc = msg.attachments.first()
      if (!attc) return
      
      const splited = attc.name.split('.')
      if (!this.supportExts.includes(splited[splited.length - 1]))
        return msg.channel.send('`' + splited[splited.length - 1] + '`는 지원하지 않는 포멧입니다\n지원: `' + this.supportExts.join(', ') + '`')

      const m = await msg.channel.send('이미지 확인됨')
      await m.edit('다운로드중...')

      const file = await get(attc.url)
      await m.edit('다운로드 완료, 크기 변경중...')

      const img = await resize(file.body, { width: attc.width * 0.5, height: attc.height * 0.5 })
      if (img.byteLength > 255999)
        return m.edit('사진의 크기가 너무 큽니다')

      m.edit('이모지 이름을 입력하세요')
      const collected = await msg.channel.awaitMessages((mf) => mf.author.id === msg.author.id, { max: 1 })

      const emoji = await msg.guild.emojis.create(img, collected.first().content)
      m.edit('완료 :' + emoji.name + ':')
    })
  }
}

new eClient()
