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
const expressSession = require("express-session");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const upload = multer({
    storage: multer.memoryStorage()
})
const users = require('./routes/users_routes')
const categories = require('./routes/categories_routes')
const products = require('./routes/products_routes')
const address = require('./routes/address_routes')
const port = process.env.PORT || 3000
app.use(expressSession({
    secret: "This is one hell of a secret",
    resave: false,
    saveUninitialized: false
}));
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
address(app)
server.listen(3000, '192.168.0.13' || 'localhost', function () {
    console.log(`ACTIVE SERVER ${process.pid}...`)
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})
module.exports = {
    app: app,
    server: server
}