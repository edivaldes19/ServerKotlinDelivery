const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
const multer = require('multer')
const serviceAccount = require('./serviceAccountKey.json')
const admin = require('firebase-admin')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const upload = multer({
    storage: multer.memoryStorage()
})
const users = require('./routes/users_routes')
const categories = require('./routes/categories_routes')
const products = require('./routes/products_routes')
const port = process.env.PORT || 3000
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.disable('x-powered-by')
app.set('port', port)
users(app, upload)
categories(app, upload)
products(app, upload)
server.listen(3000, '192.168.0.13' || 'localhost', function () {
    console.log(`Backend of the Delivery mobile application for Android ${process.pid} started...`)
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})
module.exports = {
    app: app,
    server: server
}