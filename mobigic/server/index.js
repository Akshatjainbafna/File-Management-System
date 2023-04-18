const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require("./config")
const UserModel = require('./models/user')
const multer = require('multer');
const fs = require('fs')

//setting up CORS
app.use(cors({ credentials: true, origin: true }))
//body parser
app.use(express.json())
//cookie parser
app.use(cookieParser())

//Create upload folder 
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

//setting up multer(middleware) for file upload
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024, // 500KB
        files: 1 // maximum 1 file
    }
});

//user Auth
app.post('/authenticate', async (req, res) => {
    let response = {
        status: 200,
        msg: ''
    }

    const { username, password } = req.body

    try {

        const verifyUser = await UserModel.findOne({ username })

        //if user is found login
        if (verifyUser) {

            //if user and password match
            if (verifyUser.password == password) {
                res.cookie('token', username);
                response.User = verifyUser
                response.msg = 'User verified'
            } else {
                response.status = 400
                response.msg = 'Password Incorrect'
            }

            // if user is not found register and login     
        } else {

            if (username && password) {

                const saveUser = new user({ username, password })
                const saved = await saveUser.save()

                if (saved) {

                    res.cookie('token', username);
                    response.msg = "User registred and logged in"

                } else {

                    response.msg = "Technical error.",
                    response.status = 400

                }
            } else {
                response.msg = "Username or passord missing.",
                    response.status = 400
            }
        }

        res.send(response)
    } catch (err) {
        console.log(err)
    }

})

//user Logout
app.post('/logout', async (req, res) => {

    let response = {
        status: 200,
        msg: ''
    }

    try {
        res.clearCookie('token')
        response.msg = 'User logged out'
        res.send(response)
    } catch (err) {
        console.log(err)
    }
    
})

//upload file
app.post('/uploadFile', upload.single('file'), async (req, res) => {

    let response = {
        status: 200,
        msg: ''
    }
    
    if (req.file) {

        const file = req.file.originalname
        const token = req.cookies['token']
        const code = Math.floor(100000 + Math.random() * 900000)
        const imgUpdated = await UserModel.updateOne({ username: token },
            { $push: { 'files': { flName: file, code: code } } })

        if (imgUpdated.acknowledged) {
            const User = await UserModel.findOne({ username: token })
            response.User = User
            res.send(response)
        }

    }

})

//download file
app.post('/downloadFile', async (req, res) => {

    let response = {
        status: 200,
        msg: ''
    }

    const { fl } = req.body
    const file = `uploads/${fl}`;
    res.download(file);

})

//delete files
app.post('/deleteFile', async (req, res) => {

    let response = {
        status: 200,
        msg: ''
    }
    const { fl } = req.body
    const token = req.cookies['token']

    fs.unlink(`uploads/${fl}`, async function (err) {
        if (err) return console.log(err);
        const imgDelete = await UserModel.updateOne({ username: token },
            { $pull: { 'files': { flName: fl } } })
        if (imgDelete.acknowledged) {
            const User = await UserModel.findOne({ username: token })
            response.User = User
            response.msg = 'file deleted successfully'
            res.send(response)
        }
    });



})



app.listen(5000, () => {
    console.log(`App listening on port 5000`)
})