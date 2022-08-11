const { createLanguage, updateLanguage, getAllLanguages, deleteLanguage } = require("../controllers/language.controller")
const router = require("express").Router()
const { auth } = require('../middlewares/authenticator.middleware')
const { allowedRole } = require("../middlewares/roles.middleware")

router.post("/createLanguage", auth, allowedRole(["Teacher"]), createLanguage)
router.put("/:id", auth, allowedRole(["Teacher"]), updateLanguage)

router.get("/", auth, allowedRole(["Teacher"]), getAllLanguages)
router.delete("/delete/:id", auth, allowedRole(["Teacher"]), deleteLanguage)
module.exports = router