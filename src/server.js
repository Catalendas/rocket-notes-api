require("dotenv/config")
require("express-async-errors")


const cors = require("cors")
const express = require("express")
const routes = require("./routes")
const AppError = require("./utils/AppError")
const migrationsRun = require("./database/sqlite/migrations")
const uploadConfig = require("./config/upload")

migrationsRun()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER))

app.use(routes)

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "Error",
            message: error.message
        })
    }

    console.error(error)

    return res.status(500).json({
        status: "Error",
        message: "Internal server error"
    })
})

const PORT = process.env.SERVER_PORT
app.listen(PORT, () => {
    console.log(`Server is runing on Port ${PORT}`)
})