const roles = ["1012072029039624253","1012071982415761468","1012071815352418304","1012071777372999851"]
const schema = require('../schema/roles')

module.exports = {
    name: "addroles",
    description: '',
    async execute(client, message, args) {

        let data;
        try{
            data = await schema.findOne({
                guildId: message.guild.id
            })
            if(!data) {
            data = await schema.create({
                guildId: message.guild.id
            })
            }
        } catch(err) {
            console.log(err)
        }

        message.reply("Started...")

        const members = message.guild.members.cache;
        let r = 0;
        let i = 0;
        let role;
        let member;
        for (member of members) {
            await new Promise(r=>setTimeout(r,1000))
            role = message.guild.roles.cache.get(roles[r])
            console.log(`Adding the role ${role.name} for the user ${member[1].user.username}!`)
            await member[1].roles.add(role).catch(() => null)
            i++
            if(i == 600 && r < roles.length) r++, i = 0;
        }

        data.lastRole = role.id;
        await data.save().then(async() => {
            return await message.channel.send(`\\✔️ ${message.author}, done i added the roles for \`${members.size}\` member and the last role is **${role.name}**!`)
        })
    }
}
