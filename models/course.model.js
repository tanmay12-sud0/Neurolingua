var mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new mongoose.Schema(
  {
    crsNo: Number,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
    // languageId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Language",
    // },
    title: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    language: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    course: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    program: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    price: {
      data: {
        type: Number,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    price1: {
      data: {
        type: Number,
        required: false,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    price2: {
      data: {
        type: Number,
        required: false,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    description: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    courseImage: {
      data: {
        type: String,
        required: true,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
    // duration: {
    //   data: {
    //     type: String,
    //     required: true,
    //     default: "30min",
    //   },
    // },

    // status: Boolean,
    isVerified: { type: Boolean, default: false },
    // createdOn: {
    //   date_creation: Date,
    //   timezone: String,
    // },

    // totalVotes: {
    //   type: Number,
    //   default: 0,
    // },
    // deleted: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { versionKey: false, timestamps: true }
);
CourseSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, rec) => {
    delete rec._id;
  },
});

module.exports = mongoose.model("Course", CourseSchema, "Course");
