const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const config = require('./config/DB');
const userRoute = require('./routes/UserRoute');
const Resume = require("./models/Resume");

app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(express.json()); //Used to parse JSON bodies


mongoose.connect(config.url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    console.log('Database is connected successfuly!');
}).catch((err) => console.log('Can not connect to the database' + err));


let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use('/api/users', userRoute);


app.use(express.static("dist/client/"));
if(process.env.NODE_ENV =='production') {
  app.use(express.static("dist/client/"));
}

// simple route
// app.get('/', function (req, res) {
//   res.send('Hello World fro the server side');
// })


// .........................
app.post("/resume", async(req, res) => {
  let resumeData = {
      userid: req.userId,
      fullname: req.body.fullname,
      position: req.body.position,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      skills: req.body.skills,
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      languages: req.body.languages,
      objective: req.body.objective,
      experience: req.body.experience,
      project: req.body.project,
      certification: req.body.certification,
      education: req.body.education,
  };

  const resumeExit = await Resume.findOne({ userid: req.userId });
  if (resumeExit) {
      Resume.findOneAndUpdate({ userid: req.userId }, resumeData, (err, user) => {
          if (err) {
              res.status(401).send(err);
          } else {
              res.status(200).send({ message: "sucess" });
          }
      });
      return;
  }

  let resume = new Resume(resumeData);
  resume.save((error, savedResume) => {
      if (error) {
          res.status(401).send(err);
      } else {
          res.status(200).send({ message: "success" });
      }
  });
});

app.get("/template",  (req, res) => {
  Resume.findOne({ userid: req.userId }, (err, template) => {
      if (err) {
          res.status(400).send(err);
      } else {
          res.status(200).send(template);
      }
  });
});
// ........................



// set port, listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

