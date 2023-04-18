const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    files: { type: Array }
})

const User = mongoose.model('user', userSchema)

module.exports = User
