const Category = require('../models/category')
const storage = require('../utils/cloud_storage')
module.exports = {
    async getAll(req, res, next) {
        try {
            const data = await Category.getAll()
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al crear la categoría.',
                error: error
            })
        }
    },
    async create(req, res, next) {
        try {
            const category = JSON.parse(req.body.category)
            console.log('Categoría: ', category)
            const files = req.files
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`
                const url = await storage(files[0], pathImage)
                if (url != undefined && url != null) {
                    category.image = url
                }
            }
            const data = await Category.create(category)
            return res.status(201).json({
                success: true,
                message: 'Categoría creada exitosamente.',
                data: { 'id': data.id }
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al crear la categoría.',
                error: error
            })
        }
    }
}