var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvailabilitySchema = new mongoose.Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher'
  },
    language: String,
    sessionDate: Date,
    startTime: Date,
    endTime: Date,
    isBooked: {
      type: Boolean,
      default: false,
    },
    studentId: String,
  },
  {
    versionKey: false,
  }
);
AvailabilitySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, rec) => {
    delete rec._id;
  },
});

module.exports = mongoose.model(
  "Availability",
  AvailabilitySchema,
  "Availability"
);
