const mongoose = require('mongoose')

const connectDB = async() => {
    await mongoose.connect('mongodb+srv://lightningads:discord2020@cluster0-jvhay.mongodb.net/bot?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('Connected to the database')
}

module.exports = connectDB