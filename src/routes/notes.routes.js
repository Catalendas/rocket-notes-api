const { Router } = require("express")
const NotesController = require("../controller/NotesController")
const ensureAuthenticated = require("../middleware/ensureAuthenticated.js")

const notesRouter = Router()

const notesController = new NotesController()

notesRouter.use(ensureAuthenticated)

notesRouter.get("/", notesController.index)

notesRouter.post("/", notesController.create)

notesRouter.get("/:id", notesController.show)

notesRouter.delete("/:id", notesController.delete)

module.exports = notesRouter