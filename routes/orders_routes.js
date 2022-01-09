const OrdersController = require('../controllers/orders_controller')
const passport = require('passport')
module.exports = (app) => {
    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', { session: false }), OrdersController.findByStatus)
    app.get('/api/orders/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', { session: false }), OrdersController.findByClientAndStatus)
    app.post('/api/orders/create', passport.authenticate('jwt', { session: false }), OrdersController.create)
}