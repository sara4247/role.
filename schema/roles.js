const mongoose = require('mongoose')

const RoleSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },

    lastRole: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('Roles', RoleSchema)