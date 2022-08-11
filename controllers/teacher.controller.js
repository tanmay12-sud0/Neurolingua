const logger = require("../loggingFunction");
const lineNumber = require("../lineNumberFunction");
const { teacherProfile, teacherExpirence } = require("../utils/detailData");

const teacherModel = require("../models/teacher.model");
const courseModel = require("../models/course.model");

var _ = require("lodash");
const { parallelValidator, parseDataResume, parsedLanguages, seqValidator } = require("../validator");
const { body, param } = require("express-validator");
const userModel = require("../models/user.model");
const studentModel = require("../models/student.model");

exports.teacherDetails = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);

    // return console.log(req.user.id);
    var update,
      errors = [];

    errors = await seqValidator(req, [
      body("firstName").isAlpha().exists().withMessage("first name is mandatory"),
      body("lastName").isAlpha().exists().withMessage("last name is mandatory"),
      body("gender").isAlpha().exists().withMessage("gender is mandatory"),
      //body("mobileNumber").exists().withMessage("country code is mandatory"),
      // .isMobilePhone("any", { strictMode: true })
      body("mobileNumber").exists().withMessage("contact is mandatory"),

      body("motherTongue").exists().withMessage("mother tongue is mandatory"),
      //body("languageSpeak").custom((value, { req }) => parsedLanguages(value, req, "languageSpeak")),
      body("languageSpeak.*").exists().withMessage("language speak is mandatory"),
      //body("languageTeaches").custom((value, { req }) => parsedLanguages(value, req, "languageTeaches")),
      body("languageTeaches.*").exists().withMessage("language teach is mandatory"),
      body("fromState").exists().withMessage("from state is mandatory"),
      body("fromCountry").exists().withMessage("from country is mandatory"),
      body("currentState").exists().withMessage("current state is mandatory"),
      body("currentCountry").exists().withMessage("current country is mandatory"),
      body("selfIntro").exists().withMessage("self intro is mandatory"),
      //   body("teacherProfilePic").exists(), // Emplty
      body("videoURL").isURL().exists().withMessage("video URL is mandatory"),
      body("resume").custom(parseDataResume),
      body("workResume").custom(parseDataResume),
      body("certificates").custom(parseDataResume),
      body("dob").exists().withMessage("dob is mandatory"),
      body("teacherType").exists().withMessage("teacher type is mandatory"),
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
      console.log(errors);
      return res.status(200).send({
        errors: errors.array(),
      });
    }

    const languageSpeak = req.body.languageSpeak ? JSON.parse(req.body.languageSpeak) : [];
    const languageTeach = req.body.languageTeach ? JSON.parse(req.body.languageTeach) : [];

    const educationDetails = req.body.educationDetails ? JSON.parse(req.body.educationDetails) : [];
    const certificateCourses = req.body.certificateCourses ? JSON.parse(req.body.certificateCourses) : [];
    const workExperience = req.body.workExperience ? JSON.parse(req.body.workExperience) : [];

    update = teacherModel({
      userId: req.user.id,
      firstName: { data: req.body.firstName ? req.body.firstName : "" },
      lastName: { data: req.body.lastName ? req.body.lastName : "" },
      gender: { data: req.body.gender ? req.body.gender : "" },
      dob: { data: req.body.dob ? req.body.dob : "" },
      mobileNumber: { data: req.body.mobileNumber ? req.body.mobileNumber : "" },
      teacherType: { data: req.body.teacherType ? req.body.teacherType : "" },
      selfIntro: { data: req.body.selfIntro ? req.body.selfIntro : "" },
      motherTongue: { data: req.body.motherTongue ? req.body.motherTongue : "" },
      // region: {
      fromCountry: { data: req.body.fromCountry ? req.body.fromCountry : "" },
      fromState: { data: req.body.fromState ? req.body.fromState : "" },
      currentCountry: { data: req.body.currentCountry ? req.body.currentCountry : "" },
      currentState: { data: req.body.currentState ? req.body.currentState : "" },
      // },
      teacherProfilePic: {
        data: req && req.files && req.files.teacherProfilePic && req.files.teacherProfilePic[0] && req.files.teacherProfilePic[0].location,
      },
      languageSpeak: [],
      languageTeach: [],

      videoURL: { data: req.body.videoURL ? req.body.videoURL : "" },
    });

    if (languageSpeak) {
      languageSpeak.forEach((language) => {
        newLanguage = { data: language.value };
        if (update && update.languageSpeak) {
          update.languageSpeak.push(newLanguage);
        } else {
          update.languageSpeak = [];
          update.languageSpeak.push(newLanguage);
        }
      });
    }
    if (languageTeach) {
      languageTeach.forEach((language) => {
        newLanguage = { data: language.value };
        if (update && update.languageTeach) {
          update.languageTeach.push(newLanguage);
        } else {
          update.languageTeach = [];
          update.languageTeach.push(newLanguage);
        }
      });
    }

    if (educationDetails[0].title !== "") {
      // Index of file (req.files)
      educationDetails.forEach((education, index) => {
        newEducation = {
          title: education.title,
          institution: education.institute,
          location: education.locations,
          description: education.description,
          from: education.from,
          to: education.to,
          certificateFile:
            req && req.files && req.files.educationFiles && req.files.educationFiles[index] && req.files.educationFiles[index].location,
        };

        update.educationDetails.push(newEducation);
      });
    }

    if (workExperience[0].title !== "") {
      workExperience.forEach((education, index) => {
        newWork = {
          title: education.title,
          institution: education.institute,
          location: education.locations,
          description: education.description,
          from: education.from,
          to: education.to,
          certificateFile:
            req &&
            req.files &&
            req.files.workExperienceFiles &&
            req.files.workExperienceFiles[index] &&
            req.files.workExperienceFiles[index].location,
        };
        update.workExperience.push(newWork);
      });
    }

    if (certificateCourses[0].title !== "") {
      certificateCourses.forEach((education, index) => {
        newCerti = {
          title: education.title,
          institution: education.institute,
          location: education.locations,
          description: education.description,
          from: education.from,
          to: education.to,
          certificateFile:
            req && req.files && req.files.certificateFiles && req.files.certificateFiles[index] && req.files.certificateFiles[index].location,
        };
        update.certificateCourses.push(newCerti);
      });
    }

    console.log(update, "DATA");

    // console.log(req.files, "Files");
    let doc = await teacherModel.findOne({ userId: req.user.id });
    if (!doc) {
      await update
        .save()
        .then((result) => {
          console.log(result, "Teacher Created");

          ////// Saving teacher Id in User //////////////
          userModel
            .findOneAndUpdate({ _id: req.user.id }, { isOnBoarding: true, onType: result._id })
            .then((userData) => {
              return res.status(201).send({ msg: "Teacher Onboard process completed." });
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          // errors.push(e);
          return res.status(200).send({
            errors: e,
          });
        });
    } else {
      res.status(201).send({ msg: "Teacher Onboard process already completed." });
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

exports.createCoupon = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const errors = seqValidator(req, [
      body("courseId").exists().withMessage("Mandatory"),
      body("discountAmt").exists().withMessage("Mandatory"),
      body("validTill").exists().withMessage("Mandatory"),
      body("occasion").exists().withMessage("Mandatory"),
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
    const { courseId, discountAmt, validTill, occasion } = req.body;
    const coupon = new courseModel({
      generatedBy: req.user.id,
      courseId,
      discountAmt,
      validTill,
      occasion,
    });
    const couponObject = await coupon.save();
    if (couponObject) {
      await teacherModel.findOneAndUpdate({ _id: req.user.id }, { $addToSet: { coupons: couponObject._id } });
    } else {
      throw "Something went wrong";
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

exports.getTeacherOnboard = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const errors = await seqValidator(req, [
      // param("id").exists()
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
    const detailObject = await userModel
      .findOne({ _id: req.user.id }, { password: false, isVerified: false, email: false })
      .populate("onType", { courses: false, availability: false, coupons: false, teacherId: false, teacherProfilePic: false, avgRating: false });
    console.log(detailObject);
    return res.status(200).send(detailObject);
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

exports.getTeacher = async (req, res) => {
  try {
    logger("info", req, "", lineNumber.__line);
    const errors = await seqValidator(req, [
      // param("id").exists()
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

    console.log(req.user.id);
    const detailedObject = await teacherModel
      .findOne({ userId: req.user.id })
      .populate({ path: "availability.slots.booked.course", select: "language" });
    // .populate('coupons')
    // .populate("courses")
    // .populate("blogs");
    // console.log(detailedObject);
    if (detailedObject) return res.status(200).send(detailedObject);
    else throw "Nothing was found";
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

const validateProfileFields = (details) => {
  let allDetailsFilled = true;
  // let files = []
  details.forEach((detail) => {
    Object.entries(detail).forEach(([key, value]) => {
      if (value === "") {
        allDetailsFilled = false;
      }
    });
  });

  return allDetailsFilled;
};

exports.updateProfile = async (req, res) => {
  // console.log(req.body.teacherId);
  // console.log(req.files, "Files");
  let updatedData;

  let response = {
    status: false,
    message: "",
  };

  try {
    if (req.body.type === "BasicInfo") {
      // Validate Fields
      if (
        req.body.firstName === "" &&
        req.body.lastName === "" &&
        req.body.gender === "" &&
        req.body.dob === "" &&
        req.body.mobileNumber.length < 12
      ) {
        response.message = "All fields are required";
        return res.status(200).send(response);
      }

      updatedData = {
        firstName: {
          data: req.body.firstName,
          is_verified: false,
        },
        lastName: {
          data: req.body.lastName,
          is_verified: false,
        },
        gender: {
          data: req.body.gender,
          is_verified: false,
        },
        dob: {
          data: req.body.dob,
          is_verified: false,
        },
        mobileNumber: {
          data: req.body.mobileNumber,
          is_verified: false,
        },
      };
      // console.log(updatedData, "Data");
    } else if (req.body.type === "languageSkill") {
      let languageSpeak = JSON.parse(req.body.languageSpeak);
      let languageTeach = JSON.parse(req.body.languageTeach);

      if (
        req.body.teacherType === "" &&
        req.body.motherTongue === "" &&
        req.body.fromCountry === "" &&
        req.body.fromState === "" &&
        req.body.currentCountry === "" &&
        req.body.currentState === "" &&
        languageSpeak === 0 &&
        languageTeach === 0
      ) {
        response.message = "All fields are required";
        return res.status(200).send(response);
      }

      updatedData = {
        motherTongue: {
          data: req.body.motherTongue,
          is_verified: false,
        },
        teacherType: {
          data: req.body.teacherType,
          is_verified: false,
        },
        region: {
          fromCountry: {
            data: req.body.fromCountry,
            is_verified: false,
          },
          fromState: {
            data: req.body.fromState,
            is_verified: false,
          },
          currentCountry: {
            data: req.body.currentCountry,
            is_verified: false,
          },
          currentState: {
            data: req.body.currentState,
            is_verified: false,
          },
        },
        languageSpeak: [],
        languageTeach: [],
      };

      languageSpeak.forEach((language) => {
        let newObj = {
          data: language,
          is_verified: false,
        };
        updatedData.languageSpeak.push(newObj);
      });

      languageTeach.forEach((language) => {
        let newObj = {
          data: language,
          is_verified: false,
        };
        updatedData.languageTeach.push(newObj);
      });

      console.log(updatedData, "Data");
    } else if (req.body.type === "selfIntro") {
      if (req.body.videoURL === "" && req.body.selfIntro === "" && req.body.teacherProfilePic === "") {
        response.message = "All fields are required";
        return res.status(200).send(response);
      }

      updatedData = {
        videoURL: {
          data: req.body.videoURL,
          is_verified: false,
        },
        selfIntro: {
          data: req.body.selfIntro,
          is_verified: false,
        },
        teacherProfilePic: {
          data: req.body.teacherProfilePic,
          is_verified: false,
        },
      };

      if (req.files.teacherProfilePic) {
        updatedData.teacherProfilePic.data = req.files && req.files.teacherProfilePic && req.files.teacherProfilePic[0].location;
      }
      console.log(updatedData, "Data");
    } else if (req.body.type === "Certifications") {
      // console.log(req.files, "files");

      educationDetails = JSON.parse(req.body.educationDetails);
      workExperience = JSON.parse(req.body.workExperience);
      certificateCourses = JSON.parse(req.body.certificateCourses);

      // Validate Education Details
      if (!validateProfileFields(educationDetails)) {
        response.message = "Incomplete fields in Education Details ";
        return res.status(200).send(response);
      }
      // Validate work Experience Details
      if (!validateProfileFields(workExperience)) {
        response.message = "Incomplete fields in Work Experience ";
        return res.status(200).send(response);
      }
      // Validate certificate Courses Details
      if (!validateProfileFields(certificateCourses)) {
        response.message = "Incomplete fields in Certificate Courses ";
        return res.status(200).send(response);
      }

      ///////////// Creating Object to save //////////////

      updatedData = {
        educationDetails: [],
        workExperience: [],
        certificateCourses: [],
      };

      console.log(req.files.educationDetailsFiles, "Files");
      console.log(educationDetails, "E");
      if (educationDetails[0]) {
        // Index of file (req.files)
        // !(req.files && req.files.educationDetailsFiles && req.files.educationDetailsFiles[index].location) || education.certificateFile == ""
        educationDetails.forEach((education, index) => {
          // console.log(!(req.files.educationDetailsFiles && req.files.educationDetailsFiles[index].location) && education.certificateFile == "" , "C");

          if (!(req.files.educationDetailsFiles && req.files.educationDetailsFiles[index].location) && education.certificateFile == "") {
            response.message = "Please upload Education Certificate ";
            return res.status(200).send(response);
          }
          newEducation = {
            title: education.title,
            institution: education.institution,
            location: education.location,
            description: education.description,
            from: education.from,
            to: education.to,
            certificateFile:
              req &&
              req.files &&
              req.files.educationDetailsFiles &&
              req.files.educationDetailsFiles[index] &&
              req.files.educationDetailsFiles[index].location,
          };
          if (!newEducation.certificateFile && education.certificateFile) {
            newEducation.certificateFile = education.certificateFile;
          }

          updatedData.educationDetails.push(newEducation);
        });
      }

      if (workExperience[0]) {
        workExperience.forEach((work, index) => {
          if (!(req.files.workExperience && req.files.workExperience[index].location) && work.certificateFile == "") {
            response.message = "Please upload Work Experience Certificate ";
            return res.status(200).send(response);
          }
          newWork = {
            title: work.title,
            institution: work.institution,
            location: work.location,
            description: work.description,
            from: work.from,
            to: work.to,
            certificateFile:
              req &&
              req.files &&
              req.files.workExperienceFiles &&
              req.files.workExperienceFiles[index] &&
              req.files.workExperienceFiles[index].location,
          };
          if (!newWork.certificateFile && work.certificateFile) {
            newWork.certificateFile = work.certificateFile;
          }
          updatedData.workExperience.push(newWork);
        });
      }

      if (certificateCourses[0]) {
        certificateCourses.forEach((certificateC, index) => {
          if (!(req.files.certificateCoursesFiles && req.files.certificateCoursesFiles[index].location) && certificateC.certificateFile == "") {
            response.message = "Please upload Course Certificate ";
            return res.status(200).send(response);
          }
          newCerti = {
            title: certificateC.title,
            institution: certificateC.institution,
            location: certificateC.location,
            description: certificateC.description,
            from: certificateC.from,
            to: certificateC.to,
            certificateFile:
              req &&
              req.files &&
              req.files.certificateCoursesFiles &&
              req.files.certificateCoursesFiles[index] &&
              req.files.certificateCoursesFiles[index].location,
          };
          if (!newCerti.certificateFile && certificateC.certificateFile) {
            newCerti.certificateFile = certificateC.certificateFile;
          }
          updatedData.certificateCourses.push(newCerti);
        });
      }
      console.log(updatedData, "data");
    }

    await teacherModel
      .findOneAndUpdate({ _id: req.body.teacherId }, { $set: updatedData }, { new: true })
      .then((result) => {
        // console.log(result, "Result");
        if (result) {
          response.status = true;
          response.message = "Profile Updated Successfully";
          res.status(200).send(response);
        } else {
          response.message = "Failed, please try again later.";
          res.status(200).send(response);
        }
      })
      .catch((e) => {
        response.message = "Failed, please try again later.";
        response.errMessage = e;
        res.status(200).send(response);
      });
  } catch (e) {
    console.log(e);
    response.message = "Failed, please try again later";
    response.errMessage = e;
    res.status(500).send(response);
  }
};

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "pm") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

exports.addAvailabilty = async (req, res) => {
  const { availability } = req.body;
  let response = { status: false, message: "" };

  // let newAvailability = [];
  try {
    const teacherData = await teacherModel.findOne({ userId: req.user.id });
    if (teacherData.approvalStatus !== "verified") {
      response.message = "Admin Verification Pending";
      return res.status(200).send(response);
    }
    // console.log(teacherData, "Data");
    // return

    // for (i = 0; i < availability.length; i++) {
    if (!availability.slots && !availability.date) {
      response.message = "Please add some slots and date";
      return res.status(200).send(response);
    }
    newItem = {
      date: availability.date,
      slots: [],
    };

    availability.slots.forEach((slot) => {
      // console.log(parseInt(convertTime12to24(slot.start).split(":")[0]), parseInt(convertTime12to24(slot.start).split(":")[1]), "C");

      // let start = new Date(
      //   newItem.date.setHours(parseInt(convertTime12to24(slot.start).split(":")[0]), parseInt(convertTime12to24(slot.start).split(":")[1]))
      // );

      // let end = new Date(
      //   newItem.date.setHours(parseInt(convertTime12to24(slot.end).split(":")[0]), parseInt(convertTime12to24(slot.end).split(":")[1]))
      // );

      newSlot = {
        // duration: slot.duration,
        from: slot.start,
        to: slot.end,
      };

      newSlot.duration = (new Date(newSlot.to) - new Date(newSlot.from)) / 1000 / 60;
      newItem.slots.push(newSlot);
    });
    console.log(newItem, "Item");
    // newAvailability.push(newItem);
    // }
    // return;
    // Push in the date if date already exists
    if (
      teacherData.availability.some((availabilityData) => {
        new Date(availabilityData.date).getDate() == new Date(availability.date).getDate() &&
          new Date(availabilityData.date).getMonth() == new Date(availability.date).getMonth();
      })
    ) {
      teacherData.availability = teacherData.availability.map((data, i) => {
        if (new Date(data.date).getDate() == new Date(availability.date).getDate()) {
          data.slots.push(...newItem.slots);
          // console.log(data,'Item');
          // data.slots = newItem.slots;
          return data;
        } else {
          return data;
        }
      });
      console.log(JSON.stringify(teacherData.availability, null, 4), "Data");
      // return
      await teacherModel
        .findOneAndUpdate({ userId: req.user.id }, { $set: { availability: teacherData.availability } }, { upsert: true })
        .then((result) => {
          // console.log(JSON.stringify(result.availability,null,4),1);
          response.status = true;
          response.message = "Slots Added Successfully";
          res.status(200).send(response);
        })
        .catch((error) => {
          response.message = "Failed to set, Please try again";
          response.errMessage = error;
          res.status(400).send(response);
        });
    } else {
      // Create in item if date not exists

      await teacherModel
        .findOneAndUpdate({ userId: req.user.id }, { $push: { availability: newItem } })
        .then((result) => {
          console.log(2);
          response.status = true;
          response.message = "Slots Added Successfully";
          res.status(200).send(response);
        })
        .catch((error) => {
          response.message = "Failed to set, Please try again";
          response.errMessage = error;
          res.status(400).send(response);
        });
    }
    // return console.log(newItem);
  } catch (e) {
    response.message = "Internal Server Error";
    response.errMessage = e;
    res.status(500).send(response);
  }
};

exports.editAvailability = async (req, res) => {
  const { availability, courseId } = req.body;
  let response = { status: false, message: "" };
  // let newAvailability = [];
  try {
    const teacherData = await teacherModel.findOne({ userId: req.user.id });

    // for (i = 0; i < availability.length; i++) {
    if (!availability.slots && !availability.date) {
      response.message = "Please add some slots and date";
      return res.status(200).send(response);
    }
    newItem = {
      date: new Date(availability.date),
      slots: [],
    };
    availability.slots.forEach((slot) => {
      // let start = new Date(
      //   newItem.date.setHours(parseInt(convertTime12to24(slot.start).split(":")[0]), parseInt(convertTime12to24(slot.start).split(":")[1]))
      // );

      // let end = new Date(
      //   newItem.date.setHours(parseInt(convertTime12to24(slot.end).split(":")[0]), parseInt(convertTime12to24(slot.end).split(":")[1]))
      // );

      newSlot = {
        // duration: slot.duration,
        from: slot.start,
        to: slot.end,
      };
      newSlot.duration = (new Date(newSlot.to) - new Date(newSlot.from)) / 1000 / 60;
      newItem.slots.push(newSlot);
    });

    console.log(newItem, "Item");

    // console.log(date,"Date");

    if (1) {
      teacherData.availability = teacherData.availability.map((data) => {
        // console.log(data.date, newItem.date);
        if (data.date.getDate() === newItem.date.getDate()) {
          data.slots = [...newItem.slots];
          // console.log(date.slots,"l");
          return data;
        } else {
          console.log(1);
          return data;
        }
      });
    }
    // console.log(JSON.stringify(courseData.availability, null, 4), "C");
    await teacherModel
      .findOneAndUpdate({ userId: req.user.id }, { $set: { availability: teacherData.availability } })
      .then((result) => {
        console.log(1);
        response.status = true;
        response.message = "Slots Added Successfully";
        res.status(200).send(response);
      })
      .catch((error) => {
        response.message = "Failed to set, Please try again";
        response.errMessage = error;
        res.status(400).send(response);
      });
  } catch (e) {
    response.message = "Internal Server Error";
    response.errMessage = e;
    res.status(500).send(response);
  }
};

exports.rescheduleSlot = async (req, res) => {
  const { rescheduleType, slotDetails, newSlotDetails } = req.body;

  // console.log(rescheduleType)
  console.log(slotDetails, "S");
  console.log(new Date(slotDetails.date), "D");
  let slotData = new Date(slotDetails.date);
  let slotStartTime = new Date(slotDetails.start);
  let slotEndTime = new Date(slotDetails.end);

  let reschedule = {
    isScheduled: true,
    scheduledBy: "Student",
  };

  let previousTime;

  let studentId;
  //// Teacher Lets Student Select a new Time from her calendar
  if (rescheduleType === "LetStudentSelect") {
    let teacherData = await teacherModel.findOne({ userId: req.user.id });

    teacherData.availability.forEach((availability) => {
      if (
        availability.date.getDate() == slotData.getDate() &&
        availability.date.getMonth() == slotData.getMonth() &&
        availability.date.getFullYear() == slotData.getFullYear()
      ) {
        availability.slots.forEach((slot) => {
          // if(slot.from === )
          console.log(slot.from, slotStartTime, "Time");
          if (slot.from.getHours() === slotStartTime.getHours() && slot.from.getMinutes() === slotStartTime.getMinutes()) {
            previousTime = {
              duration: slot.duration,
              from: slot.from,
              to: slot.to,
            };

            studentId = slot.booked.student;

            // saving data
            slot.reschedule = reschedule;
          }
        });
      }
    });
    // console.log(JSON.stringify(teacherData.availability, null, 4),"T");

    // await teacherModel
    // .findOneAndUpdate({ userId: req.user.id }, { $set: { availability: teacherData.availability } }, { upsert: true })

    let studentData = await studentModel.findOne({ _id: studentId });

    studentData.bookedCourses.forEach((course) => {
      if (course.slotDetails.from.getHours() === slotStartTime.getHours() && course.slotDetails.from.getMinutes() === slotStartTime.getMinutes()) {
      }
    });

    console.log(JSON.stringify(studentData.bookedCourses, null, 4), "S");
  }
};
