var express = require("express");
var router = express.Router();
const { auth } = require("../middlewares/authenticator.middleware");
const { allowedRole } = require("../middlewares/roles.middleware");
const { bookSlot, getMyCourses, getMyDetails, updateProfile,likeTeacher, initiatePayment, verifiedPayment } = require("../controllers/student.controller");
const { upload } = require("../utils/uploadMulter");
  
router.post("/myDetails", auth, allowedRole(["Student"]), getMyDetails);

router.post("/bookSlot", auth, allowedRole(["Student"]), bookSlot);

router.post(
  "/updateProfile",
  auth,
  allowedRole(["Student"]),
  upload.fields([
    {
      name: "profilePic",
      maxCount: 10,
    },
  ]),
  updateProfile
);

router.post("/likeTeacher", auth, allowedRole(["Student"]),likeTeacher)

router.get("/myCourses", auth, allowedRole(["Student"]), getMyCourses);

// payment initiation using razorpay
router.post("/payment/razorpay", allowedRole(["Student"]), initiatePayment)

// post API to store data in the database after payment verification
router.post("/payment/verification", allowedRole(["Student"]), verifiedPayment)

module.exports = router;
