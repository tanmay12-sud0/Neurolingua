const router = require("express").Router();
const upload = require('multer')();
const {
  bookSlot,
  unbookSlot,
  getAllAvailable,
  getByTeacher,
  getByTeacherAndLang,
  addAvailability,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/availability.controller");
const { auth } = require("../middlewares/authenticator.middleware");
const { allowedRole } = require("../middlewares/roles.middleware");

router.get("/", getAllAvailable);
router.get("/:teacherId", getByTeacher);
router.get("/:teacherId/:language", getByTeacherAndLang);
router.post(
  "/addAvailability",
  //upload.any(),
  auth,
  allowedRole(["Teacher"]),
  addAvailability
);
router.patch(
  "/updateAvailability/:id",
  auth,
  allowedRole(["Teacher"]),
  updateAvailability
);
router.delete(
  "/deleteAvailability/:id",
  auth,
  allowedRole(["Teacher"]),
  deleteAvailability
);
router.patch("/bookSlot/:id", auth, allowedRole(["Student"]), bookSlot);
router.patch("/unbookSlot/:id", auth, allowedRole(["Student"]), unbookSlot);

module.exports = router;
