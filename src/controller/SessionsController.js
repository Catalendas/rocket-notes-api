const knex = require("../database/knex");
const AppError = require("../utils/AppError")
const { compare } = require("bcryptjs")
const authConfig = require("../config/auth")
const { sign } = require("jsonwebtoken")

class SessionsController {
    async create(req, res) {
        const {email, password} = req.body

        const user = await knex("users").where({email}).first()

        if (!user) {
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const passwordMetch = await compare(password, user.password)

        if (!passwordMetch) {
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const {expiresIn, secret} = authConfig.jwt
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return res.json({
            user,
            token
        })
    }   
}

module.exports = SessionsController