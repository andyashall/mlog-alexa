import React from 'react';
import style from './App.css';
import axios from 'axios'

var name 
var userId
var meetingId

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: ''};
  }
  init() {
    var title = "title",
        body = "dody";
    console.log(body + ", " + title)
    var data = {
      title: title,
      body: body
    }
    axios.post('/api/hello', data)
    .then( (res) => {
      console.log(res.data)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  login() {
    name = "andy"
    var data = {
      username: name
    }
    axios.post('/api/login', data)
    .then( (res) => {
      console.log(res.data.message)
      userId = res.data.userId
      console.log(userId)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createMeeting() {
    var meetingName = "Test meeting"
    var data = {
      userId: userId,
      meetingName: meetingName
    }
    axios.post('/api/createmeeting', data)
    .then( (res) => {
      console.log(res.data.message)
      meetingId = res.data.meetingId
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createAction() {
    var action = "This is the action content"
    var data = {
      userId: userId,
      meetingId: meetingId,
      action: action
    }
    axios.post('/api/createaction', data)
    .then( (res) => {
      console.log(res.data.message)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  render() {
    return (
      <div className={style.app}>
        <div className={style.butts}>
          <button onClick={this.init}>Initiate alexa</button>
          <button onClick={this.login}>Say name to alexa</button>
          <button onClick={this.createMeeting}>Create Action</button>
          <button onClick={this.createAction}>Create Action</button>
        </div>
      </div>
    );
  }
}
