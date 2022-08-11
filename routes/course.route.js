const router = require("express").Router();
const {
  createCourse,
  updateCourse,
  getAllCourse,
  deleteCourse,
  addReview,
  getCourseByTeacher,
  addAvailabiltyToCourse,
  singleCourse,
  editAvailabilityToCourse
} = require("../controllers/course.controller");
const { allowedRole, ownerCourse, userExistence, checkIfOnBoarded } = require("../middlewares/roles.middleware");

const { auth } = require("../middlewares/authenticator.middleware");
const { upload } = require("../utils/uploadMulter");

router.post("/createCourse", auth, allowedRole(["Teacher"]), upload.single("courseImage", 1), createCourse);

router.post("/updateCourse", auth, allowedRole(["Teacher"]), upload.single("courseImage", 1), updateCourse);

router.post("/deleteCourse", auth, allowedRole(["Teacher", "Admin"]), deleteCourse);

// Find a course
router.get("/", getAllCourse);

router.get("/courseData", singleCourse)

router.get("/getCourseByTeacher", auth, allowedRole(["Teacher"]), checkIfOnBoarded, getCourseByTeacher);


module.exports = router;
