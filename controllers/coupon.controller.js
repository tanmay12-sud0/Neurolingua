// const {coupon_teacher} = require("../creation")
const Coupon = require("../models/coupon.model")
// const teacherSchema = require("../models/teacherSchema")

exports.create = async (req, res) => {
    console.log("helloji");
    try {
      req.body.slug = slugify(req.body.CouponName);
      const newProduct = await new Coupon(req.body).save();
  
      res.json(newProduct);
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  };