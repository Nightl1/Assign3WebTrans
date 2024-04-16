const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: 'string',
        required: true,
        max: 255
    },
    password: {
        type: 'string',
        required: true,
    },
    // added genre for user information
    genre: {
        type: 'string',
        required: true,
    }
})

module.exports = mongoose.model('User', userSchema);