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

const randomID = require("random-id");

var Alexa = require('alexa-sdk');

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

// Alexa biz

app.get('/api/alexa', function response(req, res) {
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
};

var handlers = {

    'LaunchRequest': function () {
        this.emit('HelloWorldIntent');
    },

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    }
 
};
res.send("hello");
});

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
};

var handlers = {

    'LaunchRequest': function () {
        this.emit('HelloWorldIntent');
    },

    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!');
    }
 
};

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

function createMeeting(db, title, id, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var Meetings = db.collection('meetings');
    var meetingUrl = createUrl(title);
    Meetings.insertOne({
      _id: randomID(20),
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

function createAction(db, actionText, id, meetingId, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var Actions = db.collection('actions');
    // var Meetings = db.collection('meetings');
    Actions.insertOne({
      _id: randomID(20),
      creator: id,
      created: new Date(),
      who: "",
      actionText: actionText,
      meetingId: meetingId,
      completeBy: new Date(),
      completed: ""
    },
    function(err, result) {
        // Meetings.update(meetingId, {$inc: {
        //   actions: 1
        // }});
        assert.equal(err, null);
        console.log("Action Created");
        callback(result);
        db.close();
      }
    );
  });   
};

function createDecision(db, decisionText, id, meetingId, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var Decisions = db.collection('decisions');
    // var Meetings = db.collection('meetings');
    Decisions.insertOne({
      _id: randomID(20),
      creator: id,
      created: new Date(),
      who: "",
      decisionText: decisionText,
      meetingId: meetingId,
      completed: ""
    },
    function(err, result) {
        // Meetings.update(meetingId, {$inc: {
        //   decisions: 1
        // }});
        assert.equal(err, null);
        console.log("Decision Created");
        callback(result);
        db.close();
      }
    );
  });   
};

function createRisk(db, riskText, id, meetingId, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var Risks = db.collection('risks');
    // var Meetings = db.collection('meetings');
    Risks.insertOne({
      _id: randomID(20),
      creator: id,
      created: new Date(),
      who: "",
      riskText: riskText,
      meetingId: meetingId,
      weighting: "red",
      weightingNo: 1,
      completed: ""
    },
    function(err, result) {
        // Meetings.update(meetingId, {$inc: {
        //   risks: 1
        // }});
        assert.equal(err, null);
        console.log("Risk Created");
        callback(result);
        db.close();
      }
    );
  });   
};

function createInfo(db, infoText, id, meetingId, callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    var Info = db.collection('info');
    // var Meetings = db.collection('meetings');
    Info.insertOne({
      _id: randomID(20),
      creator: id,
      created: new Date(),
      who: "",
      infoText: infoText,
      meetingId: meetingId,
      completed: ""
    },
    function(err, result) {
        // Meetings.update(meetingId, {$inc: {
        //   info: 1
        // }});
        assert.equal(err, null);
        console.log("Info Created");
        callback(result);
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
  var id = req.body.userId;
  var meetingId = req.body.meetingId;
  var actionText = req.body.action;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

  createAction(db, actionText, id, meetingId, function(data, err){
    if (!data) {
      console.log("error");
    } else {
      console.log(res);
      res.status(200).json({
        message: "Created action called " + actionText
      });
      res.end();
    };
  });
  });

  console.log(req.body);
});

app.post('/api/createdecision', function response(req, res) {
  var id = req.body.userId;
  var meetingId = req.body.meetingId;
  var decisionText = req.body.decision;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

  createDecision(db, decisionText, id, meetingId, function(data, err){
    if (!data) {
      console.log("error");
    } else {
      console.log(res);
      res.status(200).json({
        message: "Created decision called " + decisionText
      });
      res.end();
    };
  });
  });

  console.log(req.body);
});

app.post('/api/createrisk', function response(req, res) {
  var id = req.body.userId;
  var meetingId = req.body.meetingId;
  var riskText = req.body.risk;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

  createRisk(db, riskText, id, meetingId, function(data, err){
    if (!data) {
      console.log("error");
    } else {
      console.log(res);
      res.status(200).json({
        message: "Created risk called " + riskText
      });
      res.end();
    };
  });
  });

  console.log(req.body);
});

app.post('/api/createinfo', function response(req, res) {
  var id = req.body.userId;
  var meetingId = req.body.meetingId;
  var infoText = req.body.info;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
   

  createInfo(db, infoText, id, meetingId, function(data, err){
    if (!data) {
      console.log("error");
    } else {
      console.log(res);
      res.status(200).json({
        message: "Created info called " + infoText
      });
      res.end();
    };
  });
  });

  console.log(req.body);
});

// app.get('/api/getPosts', function(req, res) {
//   MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
   
//     findDocuments(db, 'posts', function(data) {
//     if(err){
//         res.status(500).send("something went wrong");
//     }else{
//         res.send(data);
//         db.close();
//     }

//     });
//   });
// });

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
