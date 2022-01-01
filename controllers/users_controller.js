const User = require('../models/user')
const Rol = require('../models/rol')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const storage = require('../utils/cloud_storage')
module.exports = {
    async getAll(req, res, next) {
        try {
            const data = await User.getAll()
            console.log(`Usuarios: ${data}`)
            return res.status(201).json(data)
        }
        catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener todos los usuarios.'
            })
        }
    },
    async register(req, res, next) {
        try {
            const user = req.body
            const data = await User.create(user)
            await Rol.create(data.id, 1)
            const token = jwt.sign({ id: data.id, email: user.email }, keys.secretOrKey, {})
            const myData = {
                id: data.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                image: user.image,
                session_token: `JWT ${token}`
            }
            return res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente.',
                data: myData
            })
        }
        catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario.',
                error: error
            })
        }
    },
    async login(req, res, next) {
        try {
            const email = req.body.email
            const password = req.body.password
            const myUser = await User.findByEmail(email)
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inexistente.'
                })
            }
            const isPasswordValid = await bcrypt.compare(password, myUser.password)
            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {})
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }
                await User.updateSessionToken(myUser.id, `JWT ${token}`)
                return res.status(201).json({
                    success: true,
                    message: `Bienvenido ${myUser.name}`,
                    data: data
                })
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña incorrecta.',
                })
            }
        }
        catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al iniciar sesión.',
                error: error
            })
        }
    },
    async update(req, res, next) {
        try {
            const user = JSON.parse(req.body.user)
            console.log('Usario JSON: ', user)
            const files = req.files
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`
                const url = await storage(files[0], pathImage)
                if (url != undefined && url != null) {
                    user.image = url
                }
            }
            await User.update(user)
            return res.status(201).json({
                success: true,
                message: 'Información de usuario actualizada exitosamente.',
                data: user
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar la información del usuario.',
                error: error
            })
        }
    },
    async updateWithoutImage(req, res, next) {
        try {
            const user = req.body
            console.log('Usario: ', user)
            await User.update(user)
            return res.status(201).json({
                success: true,
                message: 'Información de usuario actualizada exitosamente.',
                data: user
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar la información del usuario.',
                error: error
            })
        }
    }
}