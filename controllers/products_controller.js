const Product = require('../models/product')
const storage = require('../utils/cloud_storage')
const asyncForEach = require('../utils/async_foreach')
module.exports = {
    async findByCategory(req, res, next) {
        try {
            const id_category = req.params.id_category
            const data = await Product.findByCategory(id_category)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los productos por categoría.',
                error: error
            })
        }
    },
    async create(req, res, next) {
        let product = JSON.parse(req.body.product)
        const files = req.files
        let index = 0
        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error al agregar el producto... Falta la imagen.'
            })
        } else {
            try {
                const data = await Product.create(product)
                product.id = data.id
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`
                        const url = await storage(file, pathImage)
                        if (url !== undefined && url !== null) {
                            switch (index) {
                                case 0:
                                    product.image1 = url
                                    break
                                case 1:
                                    product.image2 = url
                                    break
                                case 2:
                                    product.image3 = url
                                    break
                            }
                        }
                        await Product.update(product)
                        index++
                        if (index == files.length) {
                            return res.status(201).json({
                                success: true,
                                message: 'Producto agregado exitosamente.'
                            })
                        }
                    })
                }
                start()
            } catch (error) {
                console.log(`Error: ${error}`)
                return res.status(501).json({
                    success: false,
                    message: 'Error al agregar el producto.',
                    error: error
                })
            }
        }
    }
}