const { Router } = require("express")
const TagsController = require("../controller/TagsController")
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js")

const tagsRouters = Router()
const tagsController = new TagsController()

tagsRouters.use(ensureAuthenticated)

tagsRouters.get("/", tagsController.index)

module.exports = tagsRouters