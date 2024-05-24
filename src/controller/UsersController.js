const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const { hash, compare } = require("bcryptjs")

class UsersController {
    // Index - GET para listar um registro
    async index(req, res) {
        const database = await sqliteConnection()
        const users = await database.get("SELECT * FROM users")

        return res.json([users])
    }

    // Show - GET para exibir um registro especifico

    // Create - POST para criar um registro 
    async create(req, res) {
        const { name, email, password} = req.body

        const database = await sqliteConnection()
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (checkUserExists) {
            throw new AppError("E-mail already registered")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])

        return res.status(201).json({})

    }
    // Update - PUT para atulizar um registro
    async update(req, res) {
        const { name, email, password, old_password} = req.body
        const user_id = req.user.id

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

        if (!user) {
            throw new AppError("Nonexistent user")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("E-mail already registered")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if (password && !old_password) {
            throw new AppError("You need to enter your old password")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError("The old password is wrong")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id == ? 
        `, [user.name, user.email, user.password, user_id])

        return res.json()
    }

    // Delete - DELETE para deletar um registro
}

module.exports = UsersController