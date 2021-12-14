const express = require("express");
const bodyParser = require('body-parser');
const Course = require("./models/course");
var cors = require('cors');
const jwt = require("jwt-simple");
const User = require("./models/user")

const app = express();
app.use(cors());

app.use(bodyParser.json());
const router = express.Router();

const secret = "supersecret"

//create a new username and password
router.post("/user", function(req, res) {

    if (!req.body.username || !req.body.password) {
       res.status(400).json({ error: "Missing username and/or password"});
       return;
    }
 
    const newUser = new User({
       username: req.body.username,
       password: req.body.password,
       status:   req.body.status
    });
 
    newUser.save(function(err) {
       if (err) {
          res.status(400).send(err);
       }
       else {
          res.sendStatus(201);  // Created
       }
    });
 });


//authentication
router.post("/auth", function(req,res){
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error: "Missing username and/or password"});
        return;
     }

    User.findOne({username: req.body.username}, function(err,user){
        //connection or server err
        if(err){
            res.status(400).send(err)
        }
        //checks to see if user is in database
        else if(!user){
            res.status(401).json({error:"Bad Username"})
        }
        //checks to see is the users password is correct
        else{
            if(user.password != req.body.password){
                res.status(401).json({error:"Bad Password"})
            }
            //succesful login
            else{
                //create a token that is encoded with jwt that sends back the username encoded
                username2 = user.username
                const token = jwt.encode({username: user.username},secret)

                //respond with a token with the value of the token constant above
                res.json({
                    username2,
                    token:token})

            }
        }
    })


})


//Grab all courses in the database
router.get("/courses", function(req,res){

    let query = {};
    if(req.query.subject){
        query = {subject: req.query.genre};
    }


    Course.find(query,function(err,courses){
        if (err){
            res.status(400).send(err);
        }
        else{
            res.json(courses);
        }

    });


});

//add a course to the database
router.post("/courses", function(req,res){
    const course = new Course(req.body);
    course.save(function(err,course){
        if(err){
            res.status(400).send(err);
        }
        else{
            res.status(201).json(course)
        }
    })
})

router.get("/courses/:id", function(req, res) {
    // Use the ID in the URL path to find the Course
    Course.findById(req.params.id, function(err, course) {
       if (err) {
          res.status(400).send(err);
       } 
       else {
          res.json(course);
       }
    });
 });

 router.put("/:id", function(req, res) {
    // Course to update sent in body of request
    const course = req.body;
 
    // Replace existing Course fields with updated course
    Course.updateOne({ _id: req.params.id }, course, function(err, result) {
       if (err) {
          res.status(400).send(err);
       } 
       else if (result.n === 0) {
           res.sendStatus(404);
       } 
       else {
           res.sendStatus(204);
       }
    });
 });

 router.delete("/courses/:id", function(req, res) {
    Course.deleteOne({ _id: req.params.id }, function(err, result) {
       if (err) {
          res.status(400).send(err);
       } 
       else if (result.n === 0) {
          res.sendStatus(404);
       } 
       else {
          res.sendStatus(204);
       }
    });
 });

app.use("/api", router);
app.listen(3000);