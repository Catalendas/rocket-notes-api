const knex = require("../database/knex")

class NotesController {

    async index(req, res) {
        const { title, tags } = req.query
        const user_id = req.user.id

        let notes 

        if (tags) {
            const filterTags = tags.split(",").map(tag => tag.trim())

            notes = await knex("tags")
                .select([
                    "notes.id",
                    "notes.title",
                    "notes.user_id"
                ])
                .where("notes.user_id", user_id)
                .whereLike("notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("notes", "notes.id", "tags.note_id")
                .groupBy("notes.id")
                .orderBy("notes.title")
        } else {

            notes = await knex("notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title")
        }

        const userTags = await knex("tags").where({ user_id })
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }
        })

        return res.json(notesWithTags)
    }

    async create(req, res) {
        const user_id = req.user.id
        const { title, description, tags, links } = req.body

        const [note_id] = await knex("notes").insert({
            description,
            title,
            user_id
        })

        const linksInsert = links.map(link => ({
            note_id,
            url: link
        }))

        await knex("links").insert(linksInsert)

        const tagsInsert = tags.map(name => ({
        note_id,
           name,
           user_id
        }))

        await knex("tags").insert(tagsInsert)

        return res.json({})
    }

    async show(req, res) {
        const { id } = req.params

        const note = await knex("notes").where({ id }).first()
        const tags = await knex("tags").where({ note_id: id}).orderBy("name")
        const links = await knex("links").where({ note_id: id}).orderBy("created_at")
        
        return res.json({
            ...note,
            tags,
            links
        })
    }

    async delete(req, res) {
        const { id } = req.params

        await knex("notes").where({ id }).delete()

        return res.json()
    }
}

module.exports = NotesController