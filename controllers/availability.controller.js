const logger = require("../logger.js");
const availabilityModel = require("../models/availability.model.js");
const addAvailabilityData = []

exports.getAllAvailable = async (req, res) => {
  try {
    const all = await availabilityModel.find();
    res.status(200).json(all);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.getByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacherSlots = await availabilityModel.find({ teacherId });
    res.status(200).json(teacherSlots);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.getByTeacherAndLang = async (req, res) => {
  try {
    const { teacherId, language } = req.params;
    const teacherSlots = await availabilityModel.find({ teacherId, language });
    res.status(200).json(teacherSlots);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.addAvailability = async (req, res) => {
  try {
    //logger("info", req, "", lineNumber.__line);
    //const id = ;
    /*for (var i = 0; i < req.body.length; i++){
      console.log(i);
      const availability = new availabilityModel[];
      const newAvailability = new availabilityModel({
        
      });
      await newAvailability.save();*/
     // console.log(req.body);
      const data = []
      for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          item = req.body[key];
          //console.log(item);
          const newAvailability = new availabilityModel({
        language: req.body[key].language,
        sessionDate:req.body[key].sessionDate,
        startTime:req.body[key].startTime,
        endTime:req.body[key].endTime,
        isBooked:req.body[key].isBooked,
          });
          await newAvailability.save();
          data.push(newAvailability);
        }
        
      }
      return res.status(201).json(data);
    } 
    //
    

    
   
   // console.log(newAvailability);
   
   
catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.updateAvailability = async (req, res) => {
  try {
    //logger("info", req, "", lineNumber.__line);
    const _id = req.params.id;
    const teacherId = req.user.id;
    const slot = await availabilityModel.findOne({ _id });
    if (!slot) {
      //   logger(
      //     "error",
      //     req,
      //     { error: "Document not found (404)" },
      //     lineNumber.__line
      //   );
      console.log("Document not found (404)");
      return res
        .status(404)
        .send({ errors: [{ code: 404, message: "Document not found" }] });
    } else if (slot.teacherId !== teacherId) {
      //logger("error", req, { error: "Unauthorised" }, lineNumber.__line);
      console.log("Unauthorised (401)", lineNumber.__line);
      return res
        .status(401)
        .send({ errors: [{ code: 401, message: "Unauthorised" }] });
    }
    const updated = await availabilityModel.findByIdAndUpdate(
      _id,
      { ...req.body, _id },
      {
        new: true,
      }
    );
    return res.status(200).json(updated);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.deleteAvailability = async (req, res) => {
  try {
    //logger("info", req, "", lineNumber.__line);
    const _id = req.params.id;
    const teacherId = req.user.id;
    const slot = await availabilityModel.findOne({ _id });
    if (!slot) {
    //   logger(
    //     "error",
    //     req,
    //     { error: "Document not found (404)" },
    //     lineNumber.__line
    //   );
      console.log("Document not found (404)");
      return res
        .status(404)
        .send({ errors: [{ code: 404, message: "Document not found" }] });
    } else if (slot.teacherId !== teacherId) {
      //logger("error", req, { error: "Unauthorised" }, lineNumber.__line);
      console.log("Unauthorised (401)");
      return res
        .status(401)
        .send({ errors: [{ code: 401, message: "Unauthorised" }] });
    }
    await availabilityModel.findByIdAndRemove(_id);
    return res.sendStatus(200);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.bookSlot = async (req, res) => {
  try {
    //logger("info", req, "", lineNumber.__line);
    const _id = req.params.id;
    const studentId = req.user.id;
    const slot = await availabilityModel.findOne({ _id });
    if (!slot) {
      //   logger(
      //     "error",
      //     req,
      //     { error: "Document not found (404)" },
      //     lineNumber.__line
      //   );
      console.log("Document not found (404)");
      return res
        .status(404)
        .send({ errors: [{ code: 404, message: "Document not found" }] });
    }
    slot.isBooked = true;
    slot.studentId = studentId;
    const booked = await availabilityModel.findByIdAndUpdate(
      _id,
      { ...slot, _id },
      { new: true }
    );
    return res.status(200).json(booked);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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

exports.unbookSlot = async (req, res) => {
  try {
    //logger("info", req, "", lineNumber.__line);
    const _id = req.params.id;
    const studentId = req.user.id;
    const slot = await availabilityModel.findOne({ _id });
    if (!slot) {
      //   logger(
      //     "error",
      //     req,
      //     { error: "Document not found (404)" },
      //     lineNumber.__line
      //   );
      console.log("Document not found (404)");
      return res
        .status(404)
        .send({ errors: [{ code: 404, message: "Document not found" }] });
    } else if (slot.studentId !== studentId) {
      //logger("error", req, { error: "Unauthorised" }, lineNumber.__line);
      console.log("Unauthorised (401)");
      return res
        .status(401)
        .send({ errors: [{ code: 401, message: "Unauthorised" }] });
    }
    slot.isBooked = false;
    slot.studentId = undefined;
    const unbooked = await availabilityModel.findByIdAndUpdate(
      _id,
      { ...slot, _id },
      { new: true }
    );
    return res.status(200).json(unbooked);
  } catch (err) {
    //logger("error", req, err, lineNumber.__line);
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
