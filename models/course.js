const db = require("../db");

const Course = db.model("Course",{
    title: {type:String, required:true},
    instructor: String,
    popularity: {type: Number, min:1, max:10},
    releaseDate: {type: Date, default:Date.now},
    subject: [String]


});

module.exports = Course;