const db = require('../config/config')
const bcrypt = require('bcryptjs')
const User = {}
User.getAll = () => {
    const sql = `
    SELECT *
FROM users`
    return db.manyOrNone(sql)
}
User.findById = (id, callback) => {
    const sql = `
    SELECT id,
    email,
    name,
    lastname,
    phone,
    image,
    password,
    session_token
FROM users
WHERE id = $1`
    return db.oneOrNone(sql, id).then(user => { callback(null, user) })
}
User.findByEmail = (email) => {
    const sql = `
    SELECT u.id,
    u.email,
    u.name,
    u.lastname,
    u.phone,
    u.image,
    u.password,
    u.session_token,
    json_agg(
        json_build_object(
            'id',
            r.id,
            'name',
            r.name,
            'image',
            r.image,
            'route',
            r.route
        )
    ) AS roles
FROM users AS u
    INNER JOIN user_has_roles AS uhr ON uhr.id_user = u.id
    INNER JOIN roles AS r ON r.id = uhr.id_rol
WHERE u.email = $1
GROUP BY u.id`
    return db.oneOrNone(sql, email)
}
User.create = async (user) => {
    const hash = await bcrypt.hash(user.password, 10)
    const sql = `
    INSERT INTO users(
        email,
        name,
        lastname,
        phone,
        image,
        password,
        created_at,
        updated_at
    )
VALUES($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id`
    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        hash,
        new Date(),
        new Date()
    ])
}
User.update = (user) => {
    const sql = `
    UPDATE users
SET name = $2,
    lastname = $3,
    phone = $4,
    image = $5,
    updated_at = $6
WHERE id = $1`
    return db.none(sql, [user.id, user.name, user.lastname, user.phone, user.image, new Date()])
}
User.updateSessionToken = (id_user, session_token) => {
    const sql = `
    UPDATE users
SET session_token = $2
WHERE id = $1`
    return db.none(sql, [id_user, session_token])
}
module.exports = User