const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError.js")
const authConfig = require("../config/auth.js")

function ensureAuthenticated(req, res, next) {
    const authHeaders = req.headers.authorization

    if (!authHeaders) {
        throw new AppError("JWT token não informado", 401)
    }

    const [, token] = authHeaders.split(" ")

    try {
        const {sub: user_id} = verify(token, authConfig.jwt.secret)

        req.user = {
            id: Number(user_id)
        }

        return next()
    } catch {
        throw new AppError("JWT token invalido", 401)
    }
}

module.exports = ensureAuthenticated