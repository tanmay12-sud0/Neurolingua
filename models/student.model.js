var mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: String,

    lastName: String,

    gender: String,

    dob: Date,
    mobileNumber: String,

    fromCountry: String,

    profilePic: String,

    notificationOptions: {
      promotions: {
        type: Boolean,
        default: true,
      },
      newsUpdates: {
        type: Boolean,
        default: true,
      },
      lessonUpdates: {
        type: Boolean,
        default: true,
      },
      reminderEmails: {
        Before5Mins: {
          type: Boolean,
          default: true,
        },
        Before30Mins: {
          type: Boolean,
          default: true,
        },
        Before24Hours: {
          type: Boolean,
          default: true,
        },
      },
      desktopNotification: {
        type: Boolean,
        default: true,
      },
    },

    favoriteTeachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    bookedCourses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        slotDetails: {
          date: { type: Date, required: true },
          from: { type: Date, required: true, unique: true },
          to: { type: Date, required: true, unique: true },
        },
        reschedule: {
          isScheduled: {
            type: Boolean,
            default: false,
          },
          scheduledBy: {
            type: String,
            enum: ["Student", "Teacher"],
          },
        },
        previousTimes: [
          {
            duration: String,
            from: Date,
            to: Date,
          },
        ],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);
StudentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, rec) => {
    delete rec._id;
    delete rec.bookedCourses._id;
  },
});
module.exports = mongoose.model("Student", StudentSchema, "Student");
