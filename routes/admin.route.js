var express = require("express");
const courseSchema = require("../models/course.model");
const teacherSchema = require("../models/teacher.model");
const { allowedRole } = require("../middlewares/roles.middleware");
const { auth } = require("../middlewares/authenticator.middleware");

var router = express.Router();

const adminController = require("./../controllers/admin.controller");

router.get("/getTeachers", auth, allowedRole(["Admin","Tutor"]), adminController.getAllTeachers);

router.get("/getTeacher/:id", auth, allowedRole(["Admin"]), adminController.getTeacherData);

router.post("/approveTeacher", auth, allowedRole(["Admin","Tutor"]), adminController.approveTeacher);

router.get('/getCourses',auth,allowedRole(["Admin","Tutor"]),adminController.getAllCourses);

router.post('/approveCourse',auth,allowedRole(["Admin","Tutor"]),adminController.approveCourse);

router.post('/deleteUser',auth,allowedRole(["Admin"]),adminController.deleteUser);

module.exports = router;
