var mongoose = require("mongoose");
const { Schema } = mongoose;

const TeacherSchema = new mongoose.Schema(
  {
    firstName: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    lastName: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blogs",
      },
    ],
    teacherProfilePic: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    timezoneProp: {
      timezone: {
        type: String,
      },
      timezoneOffset: {
        type: String,
      },
    },
    teacherType: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    mobileNumber: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    gender: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    dob: {
      data: {
        type: Date,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    // aboutMe: String,
    //region: {
    fromCountry: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    fromState: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    currentCountry: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    currentState: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    // },
    profession: String,
    accent: String,
    createdOn: { type: Date, default: Date.now() },
    videoURL: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    selfIntro: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },

    consultingAggreement: Boolean,
    motherTongue: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    languageSpeak: [
      {
        data: {
          type: String,
          required: true,
        },
        is_verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    languageTeach: [
      {
        data: {
          type: String,
          required: true,
        },
        is_verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalLesson: Number,
    totalStudent: Number,
    rating: {
      score_fun: Number,
      score_motivation_guru: Number,
      score_excellent_materials: Number,
      score_conversation: Number,
      score_exam_coach: Number,
      score_proficiency: Number,
      score_business_expert: Number,
      score_great_with_kids: Number,
      score_accent_reduction: Number,
      score_tech_savvy: Number,
      score_goes_extra_miles: Number,
      score_grammar_expert: Number,
      score_medical_profession: Number,
      score_cultural_insights: Number,
    },
    educationDetails: [
      {
        certificateFile: String,
        title: String,
        institution: String,
        location: String,
        description: String,
        from: String,
        to: String,
        is_verified: {
          type: Boolean,
          default: false,
        },
        is_deleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    workExperience: [
      {
        certificateFile: String,
        // certificate_type: String,
        title: String,
        institution: String,
        locations: String,
        description: String,
        from: String,
        to: String,
        is_verified: {
          type: Boolean,
          default: false,
        },
        is_deleted: {
          type: Boolean,
          default: false,
        },
        certificate_data: Object,
      },
    ],
    certificateCourses: [
      {
        certificateFile: String,
        // certificate_type: String,
        title: String,
        institution: String,
        locations: String,
        description: String,
        from: String,
        to: String,
        is_verified: {
          type: Boolean,
          default: false,
        },
        is_deleted: {
          type: Boolean,
          default: false,
        },
        certificate_data: Object,
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: [
          {
            duration: String,
            from: {
              type: Date,
              // unique: true,
            },
            to: {
              type: Date,
              // unique: true,
            },
            booked: {
              student: {
                type: Schema.Types.ObjectId,
                ref: "Student",
              },
              course: {
                type: Schema.Types.ObjectId,
                ref: "Course",
              },
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
    ],
    approvalStatus: {
      type: String,
      enum: ["unverified", "verified", "remarked"],
      default: "unverified",
    },
    // isOnBoarding: {
    //   type: Boolean,
    //   default: false,
    // },
    ip: String,
    browser: String,
  },
  { versionKey: false, timestamps: true }
);
TeacherSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, rec) => {
    delete rec._id;
  },
});
module.exports = mongoose.model("Teacher", TeacherSchema, "Teacher");
