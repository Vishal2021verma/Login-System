//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5  =require('md5');
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB" ,function(err){
    if(!err) console.log("Database is connected..");
    else console.log(err);
});

const userSchema = new mongoose.Schema({
    email:String,
    password: String
});




const User = new mongoose.model('User', userSchema);


app.get('/', function(req,res){
    res.render('home');
});
app.get('/login', function(req,res){
    res.render('login');
});
app.get('/register', function(req,res){
    res.render('register');

});

// Post register route
app.post('/register', function(req, res){
    const newUser = new User({
        email:req.body.username,
        // password hashing with md5
        password: md5(req.body.password)
    });
    // saving newUser id and pssword in database
    newUser.save(function(err){
        if(err) console.log(err);
        else{
            res.render("secrets");
        }
    });
});

// Post login route 
app.post('/login' ,function(req,res){
    const username =  req.body.username;
    // hassing the password
    const userpassword = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else {
            if(foundUser){
                if(foundUser.password === userpassword){
                    console.log(foundUser.email + " Logged In");
                    res.render('secrets');
                }
                else{
                    res.send("Incorrect Password");
                }

            }
        }
    });
});

app.listen(3000,function(){
    console.log('Server started on port 3000.');
});