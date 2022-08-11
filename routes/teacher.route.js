const router = require("express").Router();
const {
  teacherDetails,
  createCoupon,
  getTeacherOnboard,
  getTeacher,
  updateProfile,
  addAvailabilty,
  editAvailability,
  rescheduleSlot
} = require("../controllers/teacher.controller");

const { allowedRole, checkIfOnBoarded } = require("../middlewares/roles.middleware");
const { upload } = require("../utils/uploadMulter");

const { auth } = require("../middlewares/authenticator.middleware");

router.post(
  "/personaldetail",
  auth,
  allowedRole(["Teacher"]),
  upload.fields([
    {
      name: "teacherProfilePic",
      maxCount: 10,
    },
    {
      name: "educationFiles",
      maxCount: 10,
    },
    {
      name: "workExperienceFiles",
      maxCount: 10,
    },
    {
      name: "certificateFiles",
      maxCount: 10,
    },
  ]),
  teacherDetails
);

router.post(
  "/updateProfile",
  auth,
  allowedRole(["Teacher"]),
  upload.fields([
    {
      name: "teacherProfilePic",
      maxCount: 10,
    },
    {
      name: "educationDetailsFiles",
      maxCount: 10,
    },
    {
      name: "workExperienceFiles",
      maxCount: 10,
    },
    {
      name: "certificateCoursesFiles",
      maxCount: 10,
    },
  ]),
  updateProfile
);

router.post("/createCoupon", auth, allowedRole(["Teacher"]), createCoupon);

router.get("/", auth, allowedRole(["Teacher"]), getTeacherOnboard);

router.get("/detail", auth, allowedRole(["Teacher"]), getTeacher);

router.post("/addAvailability", auth, allowedRole(["Teacher"]), checkIfOnBoarded, addAvailabilty);

router.post("/editAvailability", auth, allowedRole(["Teacher"]), checkIfOnBoarded, editAvailability);

router.post("/rescheduleSlot",auth,allowedRole(['Teacher']),checkIfOnBoarded,rescheduleSlot)

module.exports = router;
