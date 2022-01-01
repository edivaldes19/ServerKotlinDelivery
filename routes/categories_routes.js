const CategoriesController = require('../controllers/categories_controller')
const passport = require('passport')
module.exports = (app, upload) => {
    app.get('/api/categories/getAll', passport.authenticate('jwt', { session: false }), CategoriesController.getAll)
    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), CategoriesController.create)
}