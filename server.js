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

// var url = 'mongodb://docker6279hdYaJG27h:83J7Gh3d9gd6dIqtZh2d3@ds055822.mlab.com:55822/heroku_506fmv6t';

const url = require('./mongo.config.js');

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
          message: "logged in as " + name,
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
  var meetingId = "987654321";
  res.status(200).json({
    message: "Created meeting called " + meetingName,
    meetingId: meetingId
  });
  res.end();
  console.log(req.body);
  // insertPage(req.body.title, req.body.body);
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
