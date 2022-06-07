const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")

const db = new Database()

const client = new Discord.Client()

const sadWords = ["sad", "depressed", "unhappy", "angry", "hate", "dissapointment"]

const enWords = ["Cheer Up!", "Hang in there", "You are great", "Calm done!"]

db.get("encouragements").then(encouragements => {
  if(!encouragements || encouragements.length < 1){
    db.set("encouragements", enWords)
  }
})

function updateEncouragements(encM){
  db.get("encouragements").then(encouragements => {
  encouragements.push([encM])
  db.set("encouragements", encouragements)
})
}

function deleteEncouragements(index){
   db.get("encouragements").then(encouragements => {
    if(encouragements.length > index){
        encouragements.splice(index, 1)
        db.set("encouragements", encouragements)
    }

})
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + "-" + data[0]["a"]
    })
}


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
client.on("message", msg => {
  if(msg.author.bot) return


  if(msg.content === "$inspire"){
    getQuote().then(data => msg.channel.send(data))
  }

  if(sadWords.some(word => msg.content.includes(word))){
    db.get("encouragements").then(encouragements => {
        const enc = enWords[Math.floor(Math.random() * enWords.length)]
         msg.reply(enc)
    })
    
  }

  if(msg.content.startsWith("$new")) {
    encM = msg.content.split("$new ")[1]
    updateEncouragements(encM)
    msg.channel.send("New encouraging message added!")
  }

  if(msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del")[1])
    deleteEncouragements(index)
    msg.channel.send("New encouraging message deleted!")
  }


})

const mySecret = process.env['TOKEN']

client.login(mySecret)

