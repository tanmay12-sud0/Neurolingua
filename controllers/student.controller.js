const courseModel = require("../models/course.model");
// const CourseModel = require("../models/course.model");
const StudentModel = require("../models/student.model");
const TeacherModel = require("../models/teacher.model");

// packages required for payment using razorpay
// const bodyParser = require('body-parser')
const shortid = require('shortid')
const Razorpay = require('razorpay')

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



exports.bookSlot = async (req, res) => {

  let response = { status: false, message: "" };
  try {
    let { courseId, teacherId } = req.body;

    let selectedSlot = req.body.slot;
    // console.log(req.body);

    // return

    todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate() - 1);
    slotDate = new Date(selectedSlot.start);

    // console.log(slotDate, todaysDate);
    // Check if date if less than today
    if (slotDate < todaysDate) {
      response.message = "Invalid Date selected";
      return res.status(200).send(response);
    }

    // Check if course exitsts and is verified
    const courseFound = await courseModel.findOne({ _id: courseId, isVerified: true });

    if (!courseFound) {
      response.message = "Course Not Found";
      return res.status(200).send(response);
    }

    let teacherFound = await TeacherModel.findOne({ _id: teacherId, approvalStatus: "verified" });

    if (!teacherFound) {
      response.message = "Teacher Not Found";
      return res.status(200).send(response);
    }

    const booked = {
      student: req.user.onType,
      course: courseId,
    };

    console.log(booked);
    teacherFound.availability.forEach((availability) => {
      // console.log(availability.date,slotDate);
      // console.log(availability.date.getDate() === slotDate.getDate() && availability.date.getMonth() === slotDate.getMonth());

      if (availability.date.getDate() === slotDate.getDate() && availability.date.getMonth() === slotDate.getMonth()) {
        // console.log(availability,'A');
        availability.slots.forEach((slot) => {
          // console.log(slot,"T");
          // console.log(selectedSlot,"S");
          // console.log(slot.from == );
          // console.log();
          // console.log(slot.to == );
          // console.log();
          if (slot.from.getDate() == new Date(selectedSlot.start).getDate() && slot.to.getDate() == new Date(selectedSlot.end).getDate()) {
            slot.booked = booked;
          }
        });
      }
    });

    console.log(JSON.stringify(teacherFound.availability, null, 4), "AB");
    //  return
    await TeacherModel.findOneAndUpdate({ _id: teacherId, approvalStatus: "verified" }, { $set: { availability: teacherFound.availability } })
      .then(async (teacher) => {
        // console.log(teacher);
        if (teacher) {
          bookedCourse = {
            courseId,
            slotDetails: {
              date: selectedSlot.start,
              from: selectedSlot.start,
              to: selectedSlot.end,
            },
          };
          await StudentModel.findOneAndUpdate({ userId: req.user.id }, { $push: { bookedCourses: bookedCourse } })
            .then((student) => {
              // console.log(student);
              if (student) {
                response.status = true;
                response.message = "Course booked successfully";
                return res.status(200).send(response);
              } else {
                response.message = "Failed to book course";
                return res.status(200).send(response);
              }
            })
            .catch((e) => {
              response.message = "Failed to book course";
              return res.status(200).send(response);
            });
        } else {
          response.message = "Failed to book course";
          return res.status(200).send(response);
        }
      })
      .catch((e) => {
        response.message = "Failed to book course";
        return res.status(200).send(response);
      });
  } catch (e) {
    response.message = "Internal Server Error";
    response.errMessage = e;
    res.status(500).send(response);
  }
};

// exports.rescheduleSlot = async (req,res)=>{

// }

exports.getMyCourses = async (req, res) => {
  let response = { status: false, message: "" };
  try {
    myCourses = await StudentModel.findOne({ userId: req.user.id }).populate({
      path: "bookedCourses.courseId",
    });
    // console.log(studentData);
    if (myCourses) {
      response.status = true;
      response.message = "Courses Found";
      response.data = myCourses;
      res.status(200).send(response);
    } else {
      response.message = "No Courses Found";
      res.status(200).send(response);
    }
  } catch (e) {
    response.message = "Internal Server Error";
    response.errMessage = e;
    res.status(500).send(response);
  }
};

exports.getMyDetails = async (req, res) => {
  let response = { status: false, message: "" };
  await StudentModel.findOne({ userId: req.user.id })
    .then((result) => {
      if (result) {
        response.status = true;
        response.message = "User Found";
        response.data = result;
        res.status(200).send(response);
      } else {
        response.message = "User not found";
        res.status(400).send(response);
      }
    })
    .catch((e) => {
      response.message = "Internal Server Error";
      response.errMessage = e;
      res.status(500).send(response);
    });
};

exports.updateProfile = async (req, res) => {
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
        req.body.mobileNumber.length < 12 &&
        req.body.fromCountry === ""
      ) {
        response.message = "All fields are required";
        return res.status(200).send(response);
      }

      updatedData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dob: req.body.dob,
        mobileNumber: req.body.mobileNumber,
        fromCountry: req.body.fromCountry,
      };
    } else if (req.body.type === "profilePic") {
      if (req.body.profilePic === "") {
        response.message = "Please upload your photo";
        return res.status(200).send(response);
      }

      updatedData = {
        profilePic: req.body.profilePic,
      };

      if (req.files.profilePic) {
        updatedData.profilePic = req.files && req.files.profilePic && req.files.profilePic[0].location;
      }
    } else if (req.body.type === "notifications") {
      updatedData = {
        notificationOptions: {
          promotions: req.body.promotions === "false" ? false : true,
          newsUpdates: req.body.newsUpdates === "false" ? false : true,
          lessonUpdates: req.body.lessonUpdates === "false" ? false : true,
          reminderEmails: {
            Before5Mins: true,
            Before30Mins: true,
            Before24Hours: req.body.Before24Hours === "false" ? false : true,
          },
          desktopNotification: req.body.desktopNotification === "false" ? false : true,
        },
      };
    }

    // return console.log(updatedData);
    await StudentModel.findOneAndUpdate({ userId: req.user.id }, { $set: updatedData }, { new: true })
      .then((result) => {
        // console.log(result);
        if (result) {
          response.status = true;
          response.message = "Profile Updated Successfully";
          res.status(200).send(response);
        } else {
          response.message = "Student not found";
          res.status(200).send(response);
        }
      })
      .catch((e) => {
        response.message = "Failed, please try again later.";
        response.errMessage = e;
        res.status(200).send(response);
      });
  } catch (e) {
    response.message = "Failed, please try again later";
    response.errMessage = e;
    res.status(500).send(response);
  }
};

exports.likeTeacher = async (req, res) => {
  let { teacherId } = req.body;

  let response = {
    status: false,
    message: "",
  };

  try {
    let teacherFound = await TeacherModel.findById({ _id: teacherId });

    if (!teacherFound) {
      response.message = "Teacher not found";
      return res.status(200).send(response);
    }

    await StudentModel.findOneAndUpdate({ userId: req.user.id }, { $addToSet: { favoriteTeachers: teacherId } }, { new: true })
      .then((result) => {
        // console.log(result);
        if (result) {
          response.status = true;
          response.message = "Teacher Added to favorites.";
          res.status(200).send(response);
        } else {
          response.message = "Student not found";
          res.status(200).send(response);
        }
      })
      .catch((e) => {
        response.message = "Failed, please try again later.";
        response.errMessage = e;
        res.status(200).send(response);
      });
  } catch (e) {
    response.message = "Failed, please try again later";
    response.errMessage = e;
    res.status(500).send(response);
  }
};
// razorpay APIs
// app.use(bodyParser.json())

const razorpay = new Razorpay({
  // key_id: 'rzp_test_l7jUPeazfhvrak',
  // key_secret: 'wHX64vXdFTTIZYxLPlnxZnaq'
  key_id: 'rzp_live_RoP27hoIdFtGLV',
  key_secret: '0xpX6lPwk6KccSeiaE2X2QWJ'
})

exports.initiatePayment = async (req, res) => {
  const payment_capture = 1
  const amount = 1
  const currency = 'INR'

  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture
  }

  try {
    const response = await razorpay.orders.create(options)
    console.log(response)
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount
    })
  } catch (error) {
    console.log(error)
  }
};

exports.verifiedPayment = async (req, res) => {
  console.log("verification called");
  // do a validation
  const secret = '12345678'

  // console.log(req.body)

  const crypto = require('crypto')

  const shasum = crypto.createHmac('sha256', secret)
  shasum.update(JSON.stringify(req.body))
  const digest = shasum.digest('hex')

  // console.log(digest, req.headers['x-razorpay-signature'])

  if (digest === req.headers['x-razorpay-signature']) {
    console.log('request is legit')
    // process it
    // require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
  } else {
    // pass it
  }
  res.json({ status: 'ok' })
}
