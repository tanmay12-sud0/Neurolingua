const { default: strictTransportSecurity } = require("helmet/dist/middlewares/strict-transport-security")
const { read } = require("../logger")
const languageModel = require("../models/language.model")


const createLanguage = async (req, res) => {
    try {
        if (req.body.language && req.body.course && req.body.program) {
            const { language, course, program } = req.body
            if ((course === "Academic Learning" || course === "Spoken Language" || course === "Test Preparation") && (Array.isArray(program))) {
                payload = {
                    course: course,
                    language: language,
                    program: program
                }
                const doc = await languageModel.create(payload)
                console.log("document : ", doc)
                res.status(200).json({
                    msg: "Language successfully added"
                })
            } else {
                res.status(400).json({
                    msg: "Provide valid credentials"
                })
            }
        } else {
            res.status(400).json({
                msg: "Provide all credentials",
            })
        }
    } catch (e) {
        res.status(500).json({
            msg: "An error occured",
            error: e
        })
    }
}


const updateLanguage = async (req, res) => {
    try {
        if (req.params.id) {
            const doc = await languageModel.findById(req.params.id)
            // const doc = await languageModel.findByIdAndUpdate(req.params.id, {

            // })
            const keys = Object.keys(req.body)
            let payload = {}
            let temp
            keys.map(key => {
                if (key === "language" || key === "course" || key === "program") {
                    if (key === "course") {
                        if (req.body[`${key}`] === "Academic Learning" || req.body[`${key}`] === "Spoken Language" || req.body[`${key}`] === "Test Preparation") {
                            temp = {
                                [`${key}`]: req.body[`${key}`]
                            }
                            payload = { ...payload, ...temp }
                        }
                    } else {
                        temp = {
                            [`${key}`]: req.body[`${key}`]
                        }
                    }
                    payload = { ...payload, ...temp }
                }
            })
            Object.keys(payload).map(key => {
                doc[`${key}`] = payload[`${key}`]
                console.log(doc)
            })
            console.log(doc)
            const bool = await doc.save()
            console.log(bool)
            res.status(200).json(doc)
        } else {
            res.status(400).json({
                msg: "provide a valid id"
            })
        }
    } catch (e) {
        res.status(500).json({
            msg: "An error occured",
            error: e
        })
    }
}

const getAllLanguages = async (req, res) => {
    try {
        const doc = await languageModel.find()
        console.log(doc)
        res.status(200).json(doc)
    } catch (e) {
        res.status(500).json({
            msg: "An error occured",
            error: e
        })
    }
}

const deleteLanguage = async (req, res) => {
    try {
        if (req.params.id) {
            const doc = await languageModel.findByIdAndDelete(req.params.id)
            if (doc) {
                res.json({
                    msg: "Successfully deleted"
                })
            } else {
                res.json({
                    msg: "doesn't exits"
                })
            }
        } else {
            res.status(400).json({
                msg: "Provide valid id"
            })
        }
    } catch (e) {
        res.json({
            msg: "An error occured",
            error: e
        })
    }
}
module.exports = { createLanguage, updateLanguage, getAllLanguages, deleteLanguage }