const Order = require("../models/order")
const OrderHasProducts = require("../models/order_has_products")
const timeRelative = require('../utils/time_relative')
module.exports = {
    async findByClientAndStatus(req, res, next) {
        try {
            const id_client = req.params.id_client
            const status = req.params.status
            let data = await Order.findByClientAndStatus(id_client, status)
            data.forEach(d => { d.timestamp = timeRelative(new Date().getTime(), d.timestamp) })
            console.log('Order: ', data)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener las ordenes.',
                error: error
            })
        }
    },
    async findByStatus(req, res, next) {
        try {
            const status = req.params.status
            let data = await Order.findByStatus(status)
            data.forEach(d => { d.timestamp = timeRelative(new Date().getTime(), d.timestamp) })
            console.log('Order: ', data)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener las ordenes.',
                error: error
            })
        }
    },
    async create(req, res, next) {
        try {
            const order = req.body
            const data = await Order.create(order)
            for (const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.amount)
            }
            return res.status(201).json({
                success: true,
                message: 'Orden creada exitosamente.',
                data: { 'id': data.id }
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al crear la orden.',
                error: error
            })
        }
    }
}