const mongo = require('mongoose')

module.exports = async () => {
    await mongo.connect("mongodb+srv://sara:sara@role.trbzn.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })

    return mongo
}

mongo.connection.on('connected', () => {
    console.log('✅ Sucessfully connected to mongo')
})