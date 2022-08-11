const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");
const { randomNumber } = require("../utils/generateNumber");

const { body } = require("express-validator");
var _ = require("lodash");
const { seqValidator } = require("../validator");

const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const courseModel = require("../models/course.model");
const userModel = require("../models/user.model");
const { update } = require("lodash");
const { addCourseModelFormat, updateCourseModelFormat } = require("../services/courseService");
const { response } = require("express");

exports.createCourse = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);

    let errors, add;

    errors = await seqValidator(req, [
      body("title").trim().exists().withMessage("Mandatory Field"),
      body("language").trim().exists().withMessage("Mandatory Field"),
      body("course").trim().exists().withMessage("Mandatory Field"),
      body("program").trim().exists().withMessage("Mandatory Field"),
      body("price").trim().exists().withMessage("Mandatory Field"),
      body("description").trim().exists().withMessage("Mandatory Field"),
    ]);

    if (!errors.isEmpty()) {
      logger(
        "error",
        req,
        {
          errors: errors.array(),
        },
        lineNumber.__line
      );
      return res.status(400).send({
        errors: errors.array(),
      });
    }

    let teacher = await teacherModel.findOne({ userId: req.user.id });

    if (teacher.approvalStatus !== "verified") {
      return res.status(200).send({ status: 0, msg: "Admin Verification Pending" });
    }

    //abstracted thed model
    add = courseModel(addCourseModelFormat(req, req.user.id));
    const course = await add.save();
    console.log(course, "C");
    // Add CourseID in Teacher Schema

    await teacherModel.findOneAndUpdate({ userId: req.user.id }, { $push: { courses: course._id } });

    // console.log(teacher, "T");

    return res.status(201).send({ status: 1, msg: "Course Created Successfully", course });

    // logger("debug", req, courseObject, lineNumber.__line);
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    console.log(err, lineNumber.__line);
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

exports.updateCourse = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const errors = await seqValidator(req, [
      body("title").trim().exists().withMessage("Mandatory Field"),
      body("language").trim().exists().withMessage("Mandatory Field"),
      body("course").trim().exists().withMessage("Mandatory Field"),
      body("program").trim().exists().withMessage("Mandatory Field"),
      body("price").trim().exists().withMessage("Mandatory Field"),
      body("description").trim().exists().withMessage("Mandatory Field"),
    ]);
    if (!errors.isEmpty()) {
      logger(
        "error",
        req,
        {
          errors: errors.array(),
        },
        lineNumber.__line
      );
      return res.status(400).send({
        errors: errors.array(),
      });
    }

    const updatedCourse = {
      title: { data: req.body.title, is_verified: false },
      language: { data: req.body.language, is_verified: false },
      course: { data: req.body.course, is_verified: false },
      program: { data: req.body.program, is_verified: false },
      price: { data: req.body.price, is_verified: false },
      price1: { data: req.body.price1, is_verified: false },
      price2: { data: req.body.price2, is_verified: false },
      description: { data: req.body.description, is_verified: false },
    };
    // handling previous file
    if (req.file) {
      updatedCourse.courseImage = { data: req && req.file && req.file.location };
    } else {
      updatedCourse.courseImage = { data: req.body.courseImage };
    }
    updatedCourse.isVerified = false;
    // console.log(updatedCourse, "File");
    const update = await courseModel.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      { $set: updatedCourse }
    );
    if (update) {
      return res.status(200).send({ status: 1, msg: "Course Updated Successfully", data: update });
    }
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    console.log(err, lineNumber.__line);
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

exports.getAllCourse = async (req, res) => {
  try {
    let response = { status: false, message: "" };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let language = req.query.language || "";
    const course = req.query.courseType || "";
    const startPrice = parseInt(req.query.startPrice) || 0;
    const endPrice = parseInt(req.query.endPrice) || 99999999999999;
    const country = req.query.country && req.query.country.trim() || "";
    const motherTongue = req.query.motherTongue || "";

    const startIndex = (page - 1) * limit;
    let promises = [];

    let searchField = {
      isVerified: true,
      // "price.data": { "$gte": startPrice, "$lt": endPrice },
    };

    if (language !== "All") searchField["language.data"] = language;

    if (course !== "All") searchField["course.data"] = course;

    // if (motherTongue !== "") searchField[""] = motherTongue;

    console.log(searchField);
    promises.push(
      courseModel
        .find(searchField)
        .populate({
          path: "userId",
          select: "onType email roleModel",
          populate: {
            path: "onType",
            populate: {
              path: "courses",
            },
          },
        })
        .limit(limit)
        .skip(startIndex)
        .lean()
    );

    promises.push(
      teacherModel.find({ approvalStatus: "verified" }).populate({
        path: "userId",
        select: "onType email roleModel",
        populate: { path: "onType" },
      })
    );

    promises.push(
      courseModel.countDocuments(searchField).populate({
        path: "userId",
        select: "onType email roleModel",
        populate: { path: "onType" },
      })
    );

    logger("info", req, "", lineNumber.__line);
    Promise.all(promises)
      .then(([data, teachers, totalPages]) => {
        // console.log(data, "R");

        // console.log(teachers);
        let motherTongues = [];
        let countries = [];
        // For Getting all available MotherTongues and From Country
        teachers.forEach((teacher) => {
          if (!motherTongues.includes(teacher.motherTongue.data)) motherTongues.push(teacher.motherTongue.data);

          if (!countries.includes(teacher.fromCountry.data)) countries.push(teacher.fromCountry.data);
        });

        // Filter based on Price
        data = data.filter((course) => {
          if (course.price.data >= startPrice && course.price.data < endPrice) {
            return course;
          }
        });

        // console.log(data);
        // Filter based on Country
        let courses = [];
        if (country !== "") {
          data.forEach((course) => {
            if (course.userId.onType.region.fromCountry.data === country) {
              courses.push(course);
            }
          });
        } else {
          courses = data;
        }

        // Filter Based on Mother Tongue
        if (motherTongue !== "") {
          courses = courses.map((course) => {
            if (course.userId.onType.motherTongue.data === motherTongue) {
              return course;
            } else {
              return;
            }
          });
        }

        // Adding Teacher Expertise in Course(teacher) Data
        data.forEach((course) => {
          let teaches = [];
          let boards = [];
          let courses = [];
          let testPreparations = [];
          course.userId.onType.courses.forEach((myCourse) => {
            if (!teaches.includes(myCourse.language.data)) {
              teaches.push(myCourse.language.data);
            }
            if (myCourse.course.data == "Academics" && !boards.includes(myCourse.program.data)) {
              boards.push(myCourse.program.data);
            }
            if (myCourse.course.data == "Spoken Languages" && !courses.includes(myCourse.program.data)) {
              courses.push(myCourse.program.data);
            }
            if (myCourse.course.data == "Test Preparation" && !testPreparations.includes(myCourse.program.data)) {
              testPreparations.push(myCourse.program.data);
            }
          });

          course.userId.onType.expertise = {
            teaches,
            boards,
            courses,
            testPreparations,
          };
        });

        if (courses[0] && totalPages) {
          response.message = "Courses Found";
          response.status = true;
          // response.data = courses
          response.data = {
            courses,
            motherTongues,
            countries,
          };

          response.totalPages = Math.ceil(totalPages / limit);
          return res.status(200).json(response);
        } else {
          response.status = true;
          response.data = {
            motherTongues,
            countries,
          };
          response.message = "No courses found";
          return res.status(200).json(response);
        }
      })
      .catch((err) => {
        response.message = "Unable to find courses. Please try again";
        response.errMessage = err.message;
        return res.status(400).json(response);
      });
    logger("debug", req, lineNumber.__line);
  } catch (err) {
    logger("error", req, err, lineNumber.__line);
    response.message = "Internal Server Error";
    response.errMessage = err;
    res.status(500).json(response);
  }
};
exports.getCourseByTeacher = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    let promises = [];

    promises.push(courseModel.find({ userId: req.user.id }).limit(limit).skip(startIndex));

    promises.push(courseModel.countDocuments({}));

    logger("info", req, "", lineNumber.__line);
    Promise.all(promises)
      .then(([data, totalPages]) => {
        let response = { status: -1, data: "", totalPages: "", msg: "" };

        if (data.length > 0 && totalPages) {
          response.status = true;
          response.data = data;
          response.totalPages = Math.ceil(totalPages / limit);
          return res.status(200).json(response);
        } else {
          response.msg = "No courses found";
          return res.status(200).json(response);
        }
      })
      .catch((err) => {
        let response = { status: -1, msg: "", errMessage: "" };
        response.msg = "Unable to find courses. Please try again";
        response.errMessage = err.message;
        return res.status(400).json(response);
      });
    logger("debug", req, lineNumber.__line);
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
exports.deleteCourse = async (req, res) => {
  try {
    // logger("info", req, "", lineNumber.__line);
    console.log("Course", req.user);
    const courses = await courseModel.findOne({ _id: req.body.id });
    console.log("Course", courses);
    if (!courses) {
      return res.status(404).send("Not Found");
    } else if (courses.userId != req.user.id) {
      return res.status(404).send("Not Authorized");
    } else {
      courseModel
        .findByIdAndRemove({ _id: courses._id })
        .then(async (result) => {
          // Delete Course From Teacher
          await teacherModel.findOneAndUpdate({ userId: result.userId }, { $pull: { courses: result._id } });

          return res.status(200).send("Deleted Successfully");
        })
        .catch((e) => {
          console.log(e);
          return res.status(400).send("Failed to delete");
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

exports.singleCourse = async (req, res) => {
  let response = { status: false, msg: "" };

  const courseId = req.query.courseId;
  // console.log(courseId);

  try {
    await courseModel
      .findById({ _id: courseId })
      .populate({
        path: "userId",
        select: "onType email roleModel",
        populate: { path: "onType" },
      })
      .then((courseData) => {
        if (courseData) {
          response.status = true;
          response.message = "Courses Found";
          response.data = courseData;
          res.status(200).json(response);
        } else {
          response.status = true;
          response.msg = "Course Not found";
          return res.status(200).json(response);
        }
      });
  } catch (err) {
    response.message = "Internal Server Error";
    response.errMessage = err;
    res.status(500).json(response);
  }
};
