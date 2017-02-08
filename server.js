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

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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
  var userId = "1234";
  // userId = Meteor.users.findOne({'profile.fullName': name})._id;
  res.status(200).json({
    message: "logged in as " + name,
    userId: userId
  });
  res.end();
  
  console.log(req.body);
  // insertPage(req.body.title, req.body.body);
});

app.post('/api/createmeeting', function response(req, res) {
  var meetingName = req.body.meetingName;
  res.write("Created meeting called  " + meetingName);
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
