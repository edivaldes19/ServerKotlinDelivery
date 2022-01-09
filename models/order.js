const db = require('../config/config')
const Order = {}
Order.findByClientAndStatus = (id_client, status) => {
    const sql = `
    SELECT
    O.id,
    O.id_client,
    O.id_address,
    O.id_delivery,
    O.status,
    O.latitude,
    O.longitude,
    O.timestamp,
    json_agg(
        json_build_object(
            'id',
            P.id,
            'name',
            P.name,
            'description',
            P.description,
            'price',
            P.price,
            'image1',
            P.image1,
            'image2',
            P.image2,
            'image3',
            P.image3,
            'amount',
            OHP.amount
        )
    ) AS products,
    json_build_object(
        'id',
        U.id,
        'name',
        U.name,
        'lastname',
        U.lastname,
        'image',
        U.image
    ) AS client,
    json_build_object(
        'id',
        A.id,
        'address',
        A.address,
        'suburb',
        A.suburb,
        'latitude',
        A.latitude,
        'longitude',
        A.longitude
    ) AS address
FROM
    orders AS O
    INNER JOIN users as U ON O.id_client = U.id
    INNER JOIN address as A ON A.id = O.id_address
    INNER JOIN order_has_products AS OHP ON OHP.id_order = O.id
    INNER JOIN products AS P ON P.id = OHP.id_product
WHERE
    O.id_client = $1
    AND status = $2
GROUP BY
    O.id,
    U.id,
    A.id
ORDER BY
    O.timestamp DESC`
    return db.manyOrNone(sql, [id_client, status])
}
Order.findByStatus = (status) => {
    const sql = `
    SELECT
    O.id,
    O.id_client,
    O.id_address,
    O.id_delivery,
    O.status,
    O.latitude,
    O.longitude,
    O.timestamp,
    json_agg(
        json_build_object(
            'id',
            P.id,
            'name',
            P.name,
            'description',
            P.description,
            'price',
            P.price,
            'image1',
            P.image1,
            'image2',
            P.image2,
            'image3',
            P.image3,
            'amount',
            OHP.amount
        )
    ) AS products,
    json_build_object(
        'id',
        U.id,
        'name',
        U.name,
        'lastname',
        U.lastname,
        'image',
        U.image
    ) AS client,
    json_build_object(
        'id',
        A.id,
        'address',
        A.address,
        'suburb',
        A.suburb,
        'latitude',
        A.latitude,
        'longitude',
        A.longitude
    ) AS address
FROM
    orders AS O
    INNER JOIN users as U ON O.id_client = U.id
    INNER JOIN address as A ON A.id = O.id_address
    INNER JOIN order_has_products AS OHP ON OHP.id_order = O.id
    INNER JOIN products AS P ON P.id = OHP.id_product
WHERE
    status = $1
GROUP BY
    O.id,
    U.id,
    A.id
ORDER BY
    O.timestamp DESC`
    return db.manyOrNone(sql, status)
}
Order.create = (order) => {
    const sql = `
    INSERT INTO
    orders(
        id_client,
        id_address,
        status,
        timestamp,
        created_at,
        updated_at
    )
VALUES
    ($1, $2, $3, $4, $5, $6) RETURNING id`
    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now(),
        new Date(),
        new Date()
    ])
}
module.exports = Order