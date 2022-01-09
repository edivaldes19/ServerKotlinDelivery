const db = require('../config/config')
const OrderHasProducts = {}
OrderHasProducts.create = (id_order, id_product, amount) => {
    const sql = `
    INSERT INTO
    order_has_products(
        id_order,
        id_product,
        amount,
        created_at,
        updated_at
    )
VALUES
    ($1, $2, $3, $4, $5)`
    return db.none(sql, [
        id_order,
        id_product,
        amount,
        new Date(),
        new Date()
    ])
}
module.exports = OrderHasProducts