const UsersController = require('../controllers/users_controller')
const passport = require('passport')
module.exports = (app, upload) => {
    app.get('/api/users/getAll', UsersController.getAll)
    app.get('/api/users/findDeliveryMan', UsersController.findDeliveryMan, passport.authenticate('jwt', { session: false }))
    app.post('/api/users/create', UsersController.register)
    app.post('/api/users/login', UsersController.login)
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), UsersController.update)
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }), UsersController.updateWithoutImage)
}