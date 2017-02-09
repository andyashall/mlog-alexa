/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// const url = require('./mongo.config.js');
const url = process.env.MONGO_URL;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
});

// Funcs

function findUser(db, name, callback) {
  var user = db.collection('users').findOne({username: name}, function(err, doc){
    if (doc) {
      callback(doc);
      console.log(doc);
    } else {
      callback(err);
      console.log(doc);
    };
  });
};

// function findMeetingId(db, meetingUrl) {
//   var user = db.collection('meetings').findOne({url: meetingUrl}, function(err, doc){
//     if (doc) {
//       return doc;
//       console.log(doc);
//     } else {
//       return err;
//       console.log(doc);
//     };
//   });
// };

function createMeeting(db, title, id, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var Meetings = db.collection('meetings');
    var meetingUrl = createUrl(title);
    Meetings.insertOne({
      creator: id,
      created: new Date(),
      book: "Alexa",
      title: title,
      url: meetingUrl,
      body: "",
      attendeesString: [id],
      actions: 0,
      decisions: 0,
      risks: 0,
      info: 0
    },
    function(err, result) {
        assert.equal(err, null);
        console.log("Meeting Created");
        var meetingId = result.insertedId;
        callback(meetingId);
        db.close();
      }
    );
  });   
};

function createUrl(title) {
    var dirty = title.replace(/-/g, "").replace(/\//g, "-").replace(/\s+/g, '-').toLowerCase(),
        symToText = dirty.replace(/&/g, "and").replace(/@/g, "at"),
        meetingUrl = symToText.replace(/[|&;$%@"<>()+,]/g, "") + "-" + getRandom(5);
    return meetingUrl;  
};

function getRandom(length) {
return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
};

// API

// var name, userId;

app.post('/api/hello', function response(req, res) {
  res.write("Opening mlog, to log in please state your name");
  res.end();
  console.log(req.body);
  // insertPage(req.body.title, req.body.body);
});

app.post('/api/login', function response(req, res) {
  var name = req.body.username;
  var userId;
  // userId = Meteor.users.findOne({'profile.fullName': name})._id;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

    findUser(db, name, function(data, err){
      if (!data) {
        res.status(200).json({
          message: "User " + name + " not found, please try again or create an mlog account if you haven't already.",
          userId: ""
        });
        res.end();
      } else {
        userId = data._id;
        res.status(200).json({
          message: "logging in as " + name + " please login to the mlog web app to confirm your login attempt",
          userId: userId
        });
        // res.send(data);
        res.end();
        db.close();
      }
    });
  });
  
  
  console.log(req.body);
  // insertPage(req.body.title, req.body.body);
});

app.post('/api/createmeeting', function response(req, res) {
  var meetingName = req.body.meetingName;
  var id = req.body.userId;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

  createMeeting(db, meetingName, id, function(data, err){
    if (!data) {
      console.log("error");
    } else {
      console.log(res);
      res.status(200).json({
        message: "Created meeting called " + meetingName,
        meetingId: data
      });
      res.end();
    };
  });
  });

  console.log(req.body);
});

app.post('/api/createaction', function response(req, res) {
  var meetingName = req.body.meetingName;
  var id = req.body.userId;
  var meetingId = "987654321";

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

  createMeeting(db, meetingName, id, function(data, err){
    if (!data) {
      console.log("error");
    } else {
      console.log(res);
      res.status(200).json({
        message: "Created meeting called " + meetingName,
        meetingId: meetingId
      });
      res.end();
    };
  });
  });

  console.log(req.body);
});

app.post('/api/createaction', function response(req, res) {
  var action = req.body.action;
  res.status(200).json({
    message: "Created action: " + action
  });
  res.end();
  console.log(req.body);
  // insertPage(req.body.title, req.body.body);
});

app.get('/api/getPosts', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   
    // insertDocuments(db, function() {
    //   db.close();
    // });
    findDocuments(db, 'posts', function(data) {
    if(err){
        res.status(500).send("something went wrong");
    }else{
        res.send(data);
        db.close();
    }

    });
  });
});

// Webpack

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
