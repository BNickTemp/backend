const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://sdevuser:sdev255@cluster0.adnml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true});

module.exports = mongoose;

