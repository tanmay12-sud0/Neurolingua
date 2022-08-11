const router = require("express").Router();
const {createCourse, updateCourse, getAllCourse, deleteCourse, addReview, getCourseByTeacher} = require('../controllers/course.controller');
const {allowedRole, ownerCourse, userExistence} = require("../middlewares/roles.middleware");

const {auth} = require("../middlewares/authenticator.middleware");
const { upload } = require("../utils/uploadMulter");
const { createHomework } = require("../controllers/homework.controller");





router.post('/createHomework', auth, allowedRole(["Teacher"]), upload.single('courseImage', 1), createHomework);

/*router.post('/updateHomework', auth, allowedRole(["Teacher"]), upload.single('courseImage', 1), updateCourse);

router.put('/:id', auth, allowedRole(["Teacher", "Admin"]), ownerCourse, upload.single('courseImage', 1), updateCourse);

router.delete('/rest/:id', auth, allowedRole(["Teacher", "Admin"]), ownerCourse, deleteCourse);

router.get('/', getAllCourse);

router.get('/getCourseByTeacher', auth, allowedRole(["Teacher"]), getCourseByTeacher);
*/

module.exports = router;