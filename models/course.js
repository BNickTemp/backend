const db = require("../db");

const Course = db.model("Course",{
    course: {type:String, required:true},
    instructor: String,
    subject: String

});

module.exports = Course;

