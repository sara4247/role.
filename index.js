const Discord = require('discord.js');

const { Client, Intents, Collection } = require('discord.js')

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_BANS],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
 });
const prefix = "!" 

const mongodb = require('./mongo')()
const schema = require('./schema/roles')

client.commands = new Discord.Collection();
const fs = require('fs');
const folder = fs.readdirSync('./commands/').filter(file=> file.endsWith('.js'))

for (const file of (folder))
{
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command)
}


client.on('messageCreate',async message=>{
  const [cmd] = message.content.split(' ');
  if (!message.guild) return;
  if (!cmd.startsWith(prefix)) return;
  if (message.author.bot) return;

  client.commands.find(command => {
    if (command.name == cmd.slice(prefix.length) || command.aliases && command.aliases.includes(cmd.slice(prefix.length))){

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      command.execute(client, message, args, { executed: true });
      
    } 
  });
})

client.on('ready',async (client)=>{
  console.log("The bot is online");
})

//Adding roles for new users
client.on('guildMemberAdd',async (client, member)=>{
  let data;
  try{
      data = await schema.findOne({
          guildId: member.guild.id
      })
      if(!data) {
        return;
      }
  } catch(err) {
      console.log(err)
  }

  const role = member.guild.roles.cache.get(data.lastRole)
  member.roles?.add(role).catch(() => null);
})





client.login(process.env.token);



