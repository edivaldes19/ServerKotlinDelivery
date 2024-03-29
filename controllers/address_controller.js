const Address = require("../models/address")
module.exports = {
    async create(req, res, next) {
        try {
            const address = req.body
            const data = await Address.create(address)
            return res.status(201).json({
                success: true,
                message: 'Dirección agregada exitosamente.',
                data: { 'id': data.id }
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al crear la dirección.',
                error: error
            })
        }
    },
    async findByUser(req, res, next) {
        try {
            const id_user = req.params.id_user
            const data = await Address.findByUser(id_user)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al crear la dirección.',
                error: error
            })
        }
    }
}