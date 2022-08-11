const lineNumber = require("../lineNumberFunction");
const logger = require("../loggingFunction");
const { randomNumber } = require("../utils/generateNumber");

const { body } = require("express-validator");
var _ = require("lodash");
const { seqValidator } = require("../validator");

const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const homeworkModel = require("../models/homework.model");
const { update } = require("lodash");
const { addCourseModelFormat, updateCourseModelFormat } = require("../services/courseService");
const { addHomeworkModelFormat } = require("../services/homeworkService");

exports.createHomework = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);

    let errors, add;
    errors = await seqValidator(req, [
      body("title").trim().exists().withMessage("Mandatory Field"),
      body("description").trim().exists().withMessage("Mandatory Field")      
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
    
    //abstracted thed model
    add = homeworkModel(addHomeworkModelFormat(req, req.user.id));
    await add.save()
      .then((result) => {
        return res.status(201).send({ status: 1, msg: "Homework Created Successfully", result })
      });


    //logger("debug", req, courseObject, lineNumber.__line);

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
/*
exports.updateCourse = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const errors = await seqValidator(req, [
      body("title.data").trim().exists().withMessage("Mandatory Field"),
      body("language.data").trim().exists().withMessage("Mandatory Field"),
      body("course.data").trim().exists().withMessage("Mandatory Field"),
      body("program.data").trim().exists().withMessage("Mandatory Field"),
      body("price.data").trim().exists().withMessage("Mandatory Field"),
      body("description.data").trim().exists().withMessage("Mandatory Field")
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

    var filterCourse = _.pickBy(req.body, function (value, key) {
      return !(value === "" || value === undefined);
    });

    const updateCourse = await courseModel.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      { $set: filterCourse }
    );
    if (updateCourse) {
      return res.status(200).send({ status: 1, msg: "Course Updated Successfully", updateCourse });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    let promises = [];

    promises.push(
      courseModel.find()
        .limit(limit)
        .skip(startIndex)
    );

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
exports.getCourseByTeacher = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    let promises = [];

    promises.push(
      courseModel.find({"userId" : req.user.id})
        .limit(limit)
        .skip(startIndex)
    );

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
    logger("info", req, "", lineNumber.__line);
    const courses = await courseModel.findOne({ _id: req.body.id });

    logger("debug", req, courses, lineNumber.__line);
    if (!courses) {
      return res.status(404).send("Not Found");
    } else {
      await courseModel.findByIdAndRemove(req.params.id);
      return res.status(200).send("Deleted Successfully");
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
};*/

