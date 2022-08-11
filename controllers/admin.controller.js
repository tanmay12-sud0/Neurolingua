const teacherSchema = require("../models/teacher.model");
const courseSchema = require("../models/course.model");
const UserSchema = require("../models/user.model");
const { sendMail } = require("../utils/sendMail");
const { APPROVAL_MESSAGE, REMARK_MESSAGE } = require("../constants");
const logger = require("../loggingFunction");
const lineNumber = require("../lineNumberFunction");

exports.approveTeacher = async (req, res) => {
  try {
    let { teacherId, teacherData, unverifiedFields } = req.body;
    const teacher = await teacherSchema.findOne({ _id: teacherId }).populate("userId");
    // console.log(teacher);
    if (teacherData.userId) {
      delete teacherData.userId;
    }
    if (teacher) {
      const fullName = teacher.userId.fullName;
      const email = teacher.userId.email;

      if (unverifiedFields.length) {
        teacherData.approvalStatus = "remarked";
       // console.log(teacherData, 1);
        await teacherSchema.findOneAndUpdate({ _id: teacherId }, teacherData, { upsert: true });
        mailObj = {
          type: "Teacher",
          unverifiedFields,
        };
        await sendMail(fullName, email, REMARK_MESSAGE, mailObj);
        res.status(200).send({
          message: "Status Updated Successfully",
        });
      } else if (!unverifiedFields.length) {
        teacherData.approvalStatus = "verified";
      //  console.log(teacherData, 2);
        await teacherSchema.findOneAndUpdate({ _id: teacherId }, teacherData, { upsert: true });
        mailObj = {
          type: "Teacher",
        };
        await sendMail(fullName, email, APPROVAL_MESSAGE, mailObj);
        res.status(200).send({
          message: "Status Updated Successfully",
        });
      }
    } else {
      res.status(200).send({
        errors: {
          message: "Teacher not found",
        },
      });
    }
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    res.status(500).send({
      errors: [
        {
          code: 500,
          message: "Internal Server Error",
          error: err,
        },
      ],
    });
  }
};

exports.getAllTeachers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "";
  // console.log(search);
  const startIndex = (page - 1) * limit;

  let promises = [];

  let filter = {};

  if (search.length)
    filter = {
      "firstName.data": { $regex: search, $options: "i" },
    };

  // let sortByQuery;
  // if (sortBy.length) {
  //   if (sortBy == "country") {
  //     sortByQuery = "region.fromCountry.data";
  //   } else {
  //     sortByQuery = "approvalStatus";
  //   }
  // } else {
  //   sortByQuery = "approvalStatus";
  // }

  // console.log(sortByQuery);

  promises.push(
    teacherSchema
      .find(filter)
      .select(
        "approvalStatus certificateCourses dob educationDetails workExperience firstName gender id languageSpeak languageTeach mobileNumber motherTongue fromCountry fromState currentCountry currentState selfIntro teacherProfilePic teacherType videoURL userId approvalStatus"
      )
      .populate({ path: "userId", select: "email id fullName" })
      .sort({ approvalStatus: 1 })
      .limit(limit)
      .skip(startIndex)
  );

  promises.push(teacherSchema.countDocuments(filter));

  Promise.all(promises)
    .then(([data, totalPages]) => {
      let response = { success: false, data: "", totalPages: "" };

      if (data && totalPages) {
        response.success = true;
        response.data = data;
        response.totalPages = Math.ceil(totalPages / limit);
        return res.status(200).json(response);
      } else {
        let response = { success: false, message: "" };
        response.success = true;
        response.data = data;
        response.message = "No teacher found";
        return res.status(400).json(response);
      }
    })
    .catch((err) => {
      let response = { success: false, message: "", errMessage: "" };
      response.message = "Unable to find teachers. Please try again";
      response.errMessage = err.message;
      return res.status(400).json(response);
    });
};

exports.getTeacherData = async (req, res) => {
  await teacherSchema
    .findOne({ _id: req.params.id })
    .populate({ path: "userId", select: "fullName email isVerified roleModel -_id" })
    .then((teacher) => {
      res.status(200).send(teacher);
    })
    .catch((err) => {
      let response = { success: false, message: "", errMessage: "" };
      response.message = "Unable to find teachers. Please try again";
      response.errMessage = err.message;
      res.status(400).json(response);
    });
};

exports.getAllCourses = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const search = req.query.search || "";
  const startIndex = (page - 1) * limit;
  const sortBy = req.query.sortBy || "";
  let promises = [];

  let filter = {};
  if (search.length)
    filter = {
      "title.data": { $regex: search, $options: "i" },
    };

  let sortByQuery = { isVerified: 1 };

  if (sortBy.length) {
    if (sortBy == "createdOn") {
      sortByQuery = { createdAt: "asc" };
    } else if (sortBy == "price") {
      sortByQuery = { "price.data": "asc" };
    } else if (sortBy == "status") {
      sortByQuery = { isVerified: 1 };
    } else {
      sortByQuery = { isVerified: 1 };
    }
  } else {
    sortByQuery = { isVerified: 1 };
  }

  //console.log(sortByQuery);

  promises.push(await courseSchema.find(filter).populate({ path: "userId", select: "fullName" }).sort(sortByQuery).limit(limit).skip(startIndex));

  promises.push(await courseSchema.countDocuments(filter));

  Promise.all(promises)
    .then(([data, totalPages]) => {
      let response = { success: false, data: "", totalPages: "" };

      if (data && totalPages) {
        response.success = true;
        response.data = data;
        response.totalPages = Math.ceil(totalPages / limit);
        return res.status(200).json(response);
      } else {
        let response = { success: false, message: "" };
        response.success = true;
        response.data = data;
        response.message = "No Course found";
        return res.status(400).json(response);
      }
    })
    .catch((err) => {
      let response = { success: false, message: "", errMessage: "" };
      response.message = "Unable to find courses. Please try again";
      console.log(err);
      response.errMessage = err.message;
      return res.status(400).json(response);
    });
};

exports.approveCourse = async (req, res) => {
  try {
    let { courseId, courseData, unverifiedFields } = req.body;

    const courseFound = await courseSchema.findOne({ _id: courseId }).populate({ path: "userId", select: "fullName email" }).lean();
    // console.log(courseFound);
    if (courseFound) {
      // Object To be saved
      updatedCourse = {
        title: { is_verified: courseData.title.is_verified, data: courseData.title.data },
        language: { is_verified: courseData.language.is_verified, data: courseData.language.data },
        course: { is_verified: courseData.course.is_verified, data: courseData.course.data },
        program: { is_verified: courseData.program.is_verified, data: courseData.program.data },
        price: { is_verified: courseData.price.is_verified, data: courseData.price.data },
        description: { is_verified: courseData.description.is_verified, data: courseData.description.data },
        courseImage: {
          is_verified: courseData.courseImage.is_verified,
          data: courseData.courseImage.data,
        },
      };

      //   Check if any attribute is not verfied
      let courseVerifiedStatus = true;
      const unverifiedFields = [];
      Object.entries(updatedCourse).forEach(([key, value]) => {
        if (!value.is_verified) {
          courseVerifiedStatus = false;
          let field = {};
          field[key] = value;
          unverifiedFields.push(field);
        }
      });
      updatedCourse.isVerified = courseVerifiedStatus;

      await courseSchema.findOneAndUpdate({ _id: courseId }, updatedCourse, { upsert: true });
      if (courseVerifiedStatus) {
        mailObj = {
          type: "Course",
        };
        await sendMail(courseFound.userId.fullName, courseFound.userId.email, APPROVAL_MESSAGE, mailObj);
      } else {
        mailObj = {
          type: "Course",
          unverifiedFields,
        };
        await sendMail(courseFound.userId.fullName, courseFound.userId.email, REMARK_MESSAGE, mailObj);
      }

      res.status(200).send({
        message: "Course Updated Successfully",
      });
    } else {
      res.status(200).send({
        errors: {
          message: "Course not found",
        },
      });
    }
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    console.log(err);
    res.status(500).send({
      errors: [
        {
          code: 500,
          message: "Internal Server Error",
          error: err,
        },
      ],
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let { id } = req.body;
    await teacherSchema.deleteOne({ userId: id });
    await courseSchema.deleteMany({ userId: id });
    const userDetails = await UserSchema.findById(id);
    await UserSchema.deleteOne({ email: userDetails.email });
    //console.log(userDetails);
    res.status(200).send({
      errors: {
        message: "Teacher Deleted Successfully",
      },
    });
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    res.status(500).send({
      errors: [
        {
          code: 500,
          message: "Internal Server Error",
          error: err,
        },
      ],
    });
  }
};
