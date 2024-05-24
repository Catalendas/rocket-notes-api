const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../config/upload.js")

const UsersController = require("../controller/UsersController")
const UserAvatarController = require("../controller/UserAvatarController.js")
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js")


const userRoutes = Router()
const upload = multer(uploadConfig.MULTER)


const userController = new UsersController()
const userAvatarController = new UserAvatarController()


userRoutes.post("/", userController.create)

userRoutes.put("/", ensureAuthenticated, userController.update)

userRoutes.get("/", userController.index)

userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = userRoutes
