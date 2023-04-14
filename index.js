const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express()
const port = 3001

// This line of code will parse incoming JSON data and make it available on the req.body object
app.use(bodyParser.json());

// This line of code will parse incoming URL-encoded data and make it available on the req.body object.
app.use(bodyParser.urlencoded({extended:true}));

// Tells the server that the static files like css and javascript are in the public directory
app.use(express.static('public'));

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false
}));

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = []
app.get('/', function(req,res){
res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/signup', function(req,res){
  res.sendFile(path.join(__dirname,'auth','signup.html'));
});

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;

  const newUser = {
    email : email,
    password : password
  };
  // console.log(newUser);

   //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesn't exist)
  // return back 200 status code to the client
  if(!USERS.includes(newUser)){
    USERS.push(newUser);
    res.status(200).send("User created successfully")
  }else{
    res.write("The user already exists, please use a different email and password");
  }
  console.log(USERS);
});
app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname,'auth','login.html'));
})
app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email, password} = req.body;


  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find(function(user){
    return user.email === email && user.password ===password
  });

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  if(user){
    req.session.user = user;
    res.status(200).send("Logged in successfully");
  }else{
    res.status(401).send("Invalid email or password");
  }
});

app.get('/dashboard', (req, res) => {
  // check if the user is logged in
  const user = req.session.user;

  if (user) {
    // render the dashboard page
    res.send('Welcome to the dashboard');
  } else {
    // redirect the user to the login page
    res.redirect(path.join(__dirname,'auth','login.html'));
  }
});

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!")
})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
});

app.use(express.json());
app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   // Store the submission in the SUBMISSION array above
  // res.send("Hello World from route 4!")

});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Server running on port: ${port}`)
})