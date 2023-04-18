const mongoose = require('mongoose')
require('dotenv').config();
//connect to mongoDB Atlas
// const uri = process.env.MONGOCREDS

// connect to local mongoDB
const uri = `mongodb://localhost:27017/mobigic`
const db = mongoose.connection

try {
    mongoose.connect(uri, {

    }).then(() => {
        console.log('connected to MONGO ATLAS')
    }).catch((err) => {
        console.log('MONGO ERR', err)
    })


} catch (err) {

    console.log(err)
}