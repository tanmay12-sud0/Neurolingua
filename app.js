const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const cookieSession = require('cookie-session')

var dotenv = require('dotenv')
dotenv.config()

const blogRouter = require("./routes/blog.route");

const app = express();
const bodyParser = require("body-parser");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const _db = require("./mongodb_conn");

const passport = require("passport");
require('./controllers/passport.controller')

app.use(cookieSession({
    maxAge: 48 * 60 * 60 * 100,
    keys: ["hello"]
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/blogs", require("./routes/blog.route"));
app.use('/', require('./routes/index.route'));
app.use('/teacher', require('./routes/teacher.route')); 
app.use('/admin', require('./routes/admin.route'));
app.use('/student', require('./routes/student.route'));
app.use('/auth', require('./routes/signup.route'));
app.use('/course', require('./routes/course.route'));
app.use('/coupon', require('./routes/coupon.route'));
app.use("/language",require("./routes/language.route"))
app.use('/review', require('./routes/review.route'));
app.use('/availability', require('./routes/availability.route'));

app.use((_req, res) => {
    res
        .status(404)
        .send({code: "404", messgae: "Resource Not Found"});
});

module.exports = app;
